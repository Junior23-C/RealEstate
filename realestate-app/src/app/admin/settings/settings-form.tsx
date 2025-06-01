"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, User, Lock, Loader2, Check, Building2 } from "lucide-react"
import { useSession } from "next-auth/react"

interface SettingsFormProps {
  user: {
    id: string
    email: string
    name: string | null
    createdAt: Date
    updatedAt: Date
  }
  contactSettings: {
    id: string
    companyName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    businessHours: string | null
  }
}

export function SettingsForm({ user, contactSettings }: SettingsFormProps) {
  const router = useRouter()
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email
  })
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Contact settings form state
  const [contactData, setContactData] = useState({
    companyName: contactSettings.companyName,
    email: contactSettings.email,
    phone: contactSettings.phone,
    address: contactSettings.address,
    city: contactSettings.city,
    state: contactSettings.state,
    zipCode: contactSettings.zipCode,
    businessHours: contactSettings.businessHours ? JSON.parse(contactSettings.businessHours) : {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    }
  })

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/settings/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        setMessage("Profile updated successfully!")
        // Update the session with new data
        await update()
        router.refresh()
      } else {
        const error = await response.text()
        setMessage(`Failed to update profile: ${error}`)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/settings/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        setMessage("Password updated successfully!")
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      } else {
        const error = await response.text()
        setMessage(`Failed to update password: ${error}`)
      }
    } catch (error) {
      console.error("Error updating password:", error)
      setMessage("Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    console.log("Submitting contact data:", contactData)

    try {
      const response = await fetch("/api/admin/settings/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          companyName: contactData.companyName,
          email: contactData.email,
          phone: contactData.phone,
          address: contactData.address,
          city: contactData.city,
          state: contactData.state,
          zipCode: contactData.zipCode,
          businessHours: JSON.stringify(contactData.businessHours)
        })
      })

      if (response.ok) {
        setMessage("Contact settings updated successfully!")
        router.refresh()
      } else {
        try {
          const errorData = await response.json()
          setMessage(`Failed to update contact settings: ${errorData.details || errorData.error}`)
        } catch {
          const error = await response.text()
          setMessage(`Failed to update contact settings: ${error}`)
        }
      }
    } catch (error) {
      console.error("Error updating contact settings:", error)
      setMessage("Failed to update contact settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/admin" className="flex items-center space-x-2 mr-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span className="font-bold">Settings</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.includes("successfully") 
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}>
              {message.includes("successfully") && <Check className="h-4 w-4" />}
              {message}
            </div>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="password">
                <Lock className="h-4 w-4 mr-2" />
                Password
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Building2 className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Update your company contact details that appear on the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={contactData.companyName}
                        onChange={(e) => setContactData(prev => ({ ...prev, companyName: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={contactData.email}
                          onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={contactData.phone}
                          onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={contactData.address}
                        onChange={(e) => setContactData(prev => ({ ...prev, address: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={contactData.city}
                          onChange={(e) => setContactData(prev => ({ ...prev, city: e.target.value }))}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={contactData.state}
                          onChange={(e) => setContactData(prev => ({ ...prev, state: e.target.value }))}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={contactData.zipCode}
                          onChange={(e) => setContactData(prev => ({ ...prev, zipCode: e.target.value }))}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Business Hours</Label>
                      {Object.entries(contactData.businessHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center gap-2">
                          <Label className="w-24 capitalize">{day}:</Label>
                          <Input
                            value={hours as string}
                            onChange={(e) => setContactData(prev => ({
                              ...prev,
                              businessHours: {
                                ...prev.businessHours,
                                [day]: e.target.value
                              }
                            }))}
                            placeholder="e.g., 9:00 AM - 6:00 PM or Closed"
                            disabled={isLoading}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Contact Information"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Account Type</dt>
                  <dd className="font-medium">Administrator</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Member Since</dt>
                  <dd className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Last Updated</dt>
                  <dd className="font-medium">{new Date(user.updatedAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import Center from "@/components/Center"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { User, Phone, MapPin, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import axios from "axios"

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
`

const MainContent = styled.div`
  padding: 60px 20px;
  flex-grow: 1;
`

const SettingsContainer = styled.div`
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  gap: 8px;
`

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 10px;
`

const PageDescription = styled.p`
  color: #475569;
  font-size: 1.125rem;
  margin-bottom: 40px;
`

const TabsContainer = styled.div`
  margin-bottom: 40px;
`

const TabsList = styled.div`
  display: flex;
  border-bottom: 2px solid #e2e8f0;
`

const TabButton = styled.button`
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${({ $active }) => ($active ? '#6366f1' : 'transparent')};
  color: ${({ $active }) => ($active ? '#4338ca' : '#64748b')};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #4338ca;
  }
`

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e2e8f0;
`

const CardHeader = styled.div`
  padding: 28px 32px;
  background: #f1f5f9;
`

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
`

const CardDescription = styled.p`
  color: #64748b;
  font-size: 1rem;
`

const CardContent = styled.div`
  padding: 32px;
  background: white;
`

const CardFooter = styled.div`
  padding: 20px 32px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin: 24px 0;
`

const Label = styled.label`
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Input = styled.input`
  width: 90%;
  min-width: 0;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  color: #0f172a;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    background: white;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`

const Separator = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 24px 0;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: linear-gradient(to right, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);

  &:hover {
    background: linear-gradient(to right, #4f46e5, #4338ca);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SpinnerIcon = styled.div`
  width: 18px;
  height: 18px;
  border: 3px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const PasswordInputWrapper = styled.div`
  position: relative;
  width: 90%;
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4338ca;
  }
`

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [showPasswords, setShowPasswords] = useState({
    current: true,
    new: true,
    confirm: true
  })

  // User data state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/get-profile')
        const data = response.data

        setUserData(prev => ({
          ...prev,
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          location: data.user.location || ''
        }))
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error loading profile')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.put('/api/user/update-profile', {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        location: userData.location
      })

      const data = response.data

      toast.success('Profile updated successfully')
      setUserData(prev => ({
        ...prev,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        location: data.user.location
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (userData.newPassword !== userData.confirmPassword) {
      toast.error('New passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.put('/api/user/update-password', {
        currentPassword: userData.currentPassword,
        newPassword: userData.newPassword
      })

      const data = response.data

      toast.success('Password updated successfully')
      setUserData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <Header />
      
      <Center>
        <MainContent>
          <SettingsContainer>
            <PageTitle>Account Settings</PageTitle>
            <PageDescription>Manage your account settings and preferences.</PageDescription>
            
            <TabsContainer>
              <TabsList>
                <TabButton 
                  $active={activeTab === "profile"} 
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </TabButton>
                <TabButton 
                  $active={activeTab === "security"} 
                  onClick={() => setActiveTab("security")}
                >
                  Security
                </TabButton>
              </TabsList>
              
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and contact details.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileUpdate}>
                    <CardContent>
                      {isLoadingProfile ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                          <SpinnerIcon />
                          <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading profile...</p>
                        </div>
                      ) : (
                        <FormGrid>
                          <FormGroup>
                            <Label htmlFor="name">
                              <User size={16} />
                              Name
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={userData.name}
                              onChange={handleChange}
                              placeholder="Your full name"
                            />
                          </FormGroup>

                          <FormGroup>
                            <Label htmlFor="email">
                              <Mail size={16} />
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={userData.email}
                              onChange={handleChange}
                              placeholder="your.email@example.com"
                            />
                          </FormGroup>
                        </FormGrid>
                      )}

                      <Separator />

                      <FormGrid>
                        <FormGroup>
                          <Label htmlFor="phone">
                            <Phone size={16} />
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            placeholder="Your phone number"
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="location">
                            <MapPin size={16} />
                            Location
                          </Label>
                          <Input
                            id="location"
                            name="location"
                            value={userData.location}
                            onChange={handleChange}
                            placeholder="Your address"
                          />
                        </FormGroup>
                      </FormGrid>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading || isLoadingProfile}>
                        {isLoading ? (
                          <>
                            <SpinnerIcon />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
              
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePasswordChange}>
                    <CardContent>
                      <FormGroup>
                        <Label htmlFor="currentPassword">
                          <Lock size={16} />
                          Current Password
                        </Label>
                        <PasswordInputWrapper>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPasswords.current ? "password" : "text"}
                            value={userData.currentPassword}
                            onChange={handleChange}
                            placeholder="Your current password"
                          />
                          <PasswordToggle
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                          >
                            {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                          </PasswordToggle>
                        </PasswordInputWrapper>
                      </FormGroup>

                      <Separator />

                      <FormGroup>
                        <Label htmlFor="newPassword">
                          <Lock size={16} />
                          New Password
                        </Label>
                        <PasswordInputWrapper>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPasswords.new ? "password" : "text"}
                            value={userData.newPassword}
                            onChange={handleChange}
                            placeholder="Your new password"
                          />
                          <PasswordToggle
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                          >
                            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                          </PasswordToggle>
                        </PasswordInputWrapper>
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="confirmPassword">
                          <Lock size={16} />
                          Confirm New Password
                        </Label>
                        <PasswordInputWrapper>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPasswords.confirm ? "password" : "text"}
                            value={userData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your new password"
                          />
                          <PasswordToggle
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                          >
                            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </PasswordToggle>
                        </PasswordInputWrapper>
                      </FormGroup>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <SpinnerIcon />
                        ) : (
                          <Save size={16} />
                        )}
                        Update Password
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
            </TabsContainer>
          </SettingsContainer>
        </MainContent>
      </Center>
      
      <Footer />
    </PageContainer>
  )
}

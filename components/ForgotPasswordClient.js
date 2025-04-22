"use client"

import { useState } from "react"
import Link from "next/link"
import styled from "styled-components"

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 1.5rem;
  
  @media (min-width: 640px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`

const HeaderContainer = styled.div`
  @media (min-width: 640px) {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 28rem;
  }
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Logo = styled.svg`
  width: auto;
  height: 3rem;
  color: #4f46e5;
`

const Title = styled.h2`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 800;
  color: #111827;
`

const SubTitle = styled.p`
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #6b7280;
`

const StyledLink = styled(Link)`
  font-weight: 500;
  color: #4f46e5;
  
  &:hover {
    color: #4338ca;
  }
`

const FormContainer = styled.div`
  margin-top: 2rem;
  
  @media (min-width: 640px) {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 28rem;
  }
`

const FormCard = styled.div`
  background-color: white;
  padding: 2rem 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  
  @media (min-width: 640px) {
    border-radius: 0.5rem;
    padding: 2rem 2.5rem;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: #374151;
`

const Input = styled.input`
  margin-top: 0.25rem;
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(props) => (props.error ? "#fca5a5" : "#d1d5db")};
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-color: #4f46e5;
    border-color: #4f46e5;
  }
`

const ErrorMessage = styled.p`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #dc2626;
`

const SubmitButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: white;
  background-color: ${(props) => (props.disabled ? "#818cf8" : "#4f46e5")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  
  &:hover {
    background-color: ${(props) => (props.disabled ? "#818cf8" : "#4338ca")};
  }
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-color: #4f46e5;
  }
`

const SuccessContainer = styled.div`
  text-align: center;
`

const SuccessIconContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  border-radius: 9999px;
  background-color: #dcfce7;
`

const SuccessIcon = styled.svg`
  height: 1.5rem;
  width: 1.5rem;
  color: #16a34a;
`

const SuccessTitle = styled.h3`
  margin-top: 0.75rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 500;
  color: #111827;
`

const SuccessMessage = styled.p`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #6b7280;
`

const BackToLoginButton = styled(Link)`
  margin-top: 1.5rem;
  width: 100%;
  display: inline-flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: white;
  background-color: #4f46e5;
  
  &:hover {
    background-color: #4338ca;
  }
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-color: #4f46e5;
  }
`

const LoadingSpinner = styled.svg`
  animation: spin 1s linear infinite;
  margin-right: 0.75rem;
  margin-left: -0.25rem;
  height: 1.25rem;
  width: 1.25rem;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    setIsLoading(false)
    console.log("res : ", res)
    if (res.ok) {
      setIsSubmitted(true)
    } else {
      setError("Something went wrong. Try again.")
    }
  }

  return (
    <PageContainer>
      <HeaderContainer>
        <LogoContainer>
          <Logo viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Logo>
        </LogoContainer>
        <Title>Reset your password</Title>
        <SubTitle>
          Or <StyledLink href="/login">sign in to your account</StyledLink>
        </SubTitle>
      </HeaderContainer>

      <FormContainer>
        <FormCard>
          {!isSubmitted ? (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  error={error}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </FormGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <LoadingSpinner xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </LoadingSpinner>
                ) : null}
                Reset password
              </SubmitButton>
            </Form>
          ) : (
            <SuccessContainer>
              <SuccessIconContainer>
                <SuccessIcon
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </SuccessIcon>
              </SuccessIconContainer>
              <SuccessTitle>Check your email</SuccessTitle>
              <SuccessMessage>We've sent a password reset link to {email}</SuccessMessage>
              <BackToLoginButton href="/login">Back to login</BackToLoginButton>
            </SuccessContainer>
          )}
        </FormCard>
      </FormContainer>
    </PageContainer>
  )
}

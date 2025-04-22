"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import styled from "styled-components"

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`

const LoginCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`

const Logo = styled.svg`
  width: 3rem;
  height: 3rem;
  color: #6366f1;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #111827;
`

const SubTitle = styled.p`
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #6b7280;
`

const StyledLink = styled(Link)`
  color: #6366f1;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #374151;
`

const Input = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 1px #6366f1;
  }
`

const PasswordContainer = styled.div`
  position: relative;
`

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
`

const RememberForgotContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
`

const Checkbox = styled.input`
  margin-right: 0.5rem;
`

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #374151;
`

const ForgotPasswordLink = styled(Link)`
  font-size: 0.875rem;
  color: #6366f1;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`

const SignInButton = styled.button`
  width: 100%;
  padding: 0.625rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #4f46e5;
  }
  
  &:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before, &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e5e7eb;
  }
  
  span {
    padding: 0 0.75rem;
    font-size: 0.75rem;
    color: #6b7280;
  }
`

const SocialButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
`

const SocialButton = styled.button`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.625rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f9fafb;
  }
`

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      router.push("/")
    }
  }

  return (
    <PageContainer>
      <LoginCard>
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

        <Title>Sign in to your account</Title>
        <SubTitle>
          Or <StyledLink href="/register">create a new account</StyledLink>
        </SubTitle>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordContainer>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <PasswordToggleButton type="button" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </PasswordToggleButton>
            </PasswordContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>

          <RememberForgotContainer>
            <RememberMeContainer>
              <Checkbox
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <CheckboxLabel htmlFor="remember-me">Remember me</CheckboxLabel>
            </RememberMeContainer>
            <ForgotPasswordLink href="/forgot-password">Forgot your password?</ForgotPasswordLink>
          </RememberForgotContainer>

          <SignInButton type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </SignInButton>
        </form>

        <Divider>
          <span>Or continue with</span>
        </Divider>

        <SocialButtonsContainer>
          <SocialButton type="button" onClick={() => signIn("google")}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
              />
              <path
                fill="#34A853"
                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1272727,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
              />
              <path
                fill="#FBBC05"
                d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
              />
            </svg>
          </SocialButton>
          <SocialButton type="button" onClick={() => signIn("facebook")}>
            <svg width="24" height="24" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
            </svg>
          </SocialButton>
        </SocialButtonsContainer>
      </LoginCard>
    </PageContainer>
  )
}

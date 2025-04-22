import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail', // or Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendPasswordResetEmail(to, token) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset your password',
    html: `<p>Click below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  })
}

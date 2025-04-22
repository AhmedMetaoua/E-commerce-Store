
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { redirect } from "next/navigation"
import ResetPasswordClient from "@/components/ResetPasswordClient";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: {} }
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}

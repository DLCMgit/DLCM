import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import styles from "./Layout.module.css"

export default function Layout({ children }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const date = new Date()

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <Link href="/" style={{ textDecoration: "none", color: "white" }}>
            DLCM
          </Link>
        </h1>
        {user ? (
          <nav>
            <ul className={styles.list} role="list">
              <li>
                <button
                  className="button"
                  data-size="small"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>
      <main className="inline-max stack">{children}</main>
      <footer className={styles.footer}>
        <div className={styles.copyright}>
          <p>&copy; {`${date.getFullYear()}`} Mystery Circles</p>
        </div>
        <div className={styles.contact}>
          <a href="mailto:dlcm.app@gmail.com">Contact Us</a>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms and Conditions</Link>
        </div>
      </footer>
    </>
  )
}

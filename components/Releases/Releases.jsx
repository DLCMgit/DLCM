import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import CreateRelease from "./CreateRelease"
import styles from "./Releases.module.css"
import cn from "classnames"
import IconMusicNotesPlus from "@/icons/music-notes-plus.svg"
import Link from "next/link"

export default function Releases({ profileData }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [releases, setReleases] = useState([])
  const [allowNew, setAllowNew] = useState(true)

  useEffect(() => {
    getReleases()
  }, [supabase, profileData.id])

  async function getReleases() {
    try {
      let { data, error } = await supabase
        .from("releases")
        .select("*, codes (*)")
        .eq("user_id", profileData.id)
        .eq("codes.redeemed", "false")
        .order("created_at", { ascending: true })

      if (error) {
        throw error
      }

      if (data) {
        setReleases(data)
      }
    } catch (error) {
      alert("Error loading user releases!")
      console.log(error)
    }
  }

  return (
    <article className="stack">
      <header className="article-heading inline-wrap">
        <h2>Releases</h2>
        {profileData.is_subscribed ? (
          <CreateRelease
            trigger={
              <button className="button" data-variant="primary">
                <IconMusicNotesPlus aria-hidden="true" /> Create new release
              </button>
            }
          />
        ) : releases.length >= 2 ? (
          <Link href="/api/subscribe-to-dlcm">Subscribe</Link>
        ) : (
          <CreateRelease
            trigger={
              <button className="button" data-variant="primary">
                <IconMusicNotesPlus aria-hidden="true" />
                Create new release
              </button>
            }
          />
        )}
      </header>

      <ul className="grid" role="list">
        {releases.length ? (
          <>
            {releases.map((release, index) =>
              profileData.is_subscribed || index <= 1 ? (
                <ReleaseCard
                  key={release.id}
                  release={release}
                  user={user}
                  getReleases={getReleases}
                  profileData={profileData}
                />
              ) : null
            )}
            <li
              className={cn(styles.actionCard, "container")}
              data-variant="empty"
            >
              {profileData.is_subscribed || releases.length <= 1 ? (
                <CreateRelease
                  trigger={
                    <button
                      className={cn(styles.actionCardButton, "button")}
                      data-variant="text"
                    >
                      <IconMusicNotesPlus aria-hidden="true" />
                      Create a new release
                    </button>
                  }
                />
              ) : (
                <Link href="/subscribe">Subscribe to add more releases</Link>
              )}
            </li>
          </>
        ) : (
          <div className={cn(styles.empty, "container")} data-variant="empty">
            <p>Your releases list is currently empty.</p>
          </div>
        )}
      </ul>
    </article>
  )
}

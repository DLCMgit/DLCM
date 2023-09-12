import { useState, useEffect } from "react"
import AddCodes from "../AddCodes/AddCodes"
import cn from "classnames"
import styles from "./ReleaseCard.module.css"
import Link from "next/link"
import IconDownload from "@/icons/download.svg"
import IconRecord from "@/icons/vinyl-record.svg"
import UpdateRelease from "./UpdateRelease"
import ReleaseStats from "../ReleaseStats/ReleaseStats"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"

export default function ReleaseCard({
  release,
  user,
  getProfile,
  profileData,
}) {
  const [onCodeAdded, setOnCodeAdded] = useState(false)
  const [showReleaseUpdateView, setShowReleaseUpdateView] = useState(false)
  const [artwork, setArtwork] = useState(release.artwork_url)
  const [releaseDate, setReleaseDate] = useState(new Date(release.release_date))
  const [isActive, setIsActive] = useState(release.is_active)

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (onCodeAdded) {
      getProfile()
      setOnCodeAdded(false)
    }
  }, [onCodeAdded])

  const showRelease = async (activeStatus) => {
    try {
      setIsActive(activeStatus)
      let update = {
        is_active: activeStatus,
      }
      let { error } = await supabase
        .from("releases")
        .update(update)
        .eq("id", release.id)

      if (error) throw error
    } catch (error) {
      alert(`Error making release ${activeStatus ? "active" : "inactive"} !`)
      console.log(error)
    }
  }

  return (
    <div
      className={cn(
        styles.component,
        isActive ? styles.active : styles.inactive
      )}
    >
      <div className={styles.content}>
        <Image
          className={styles.image}
          src={artwork || "/default-image-release.png"}
          alt={release.title}
          height={250}
          width={250}
          quality={60}
        />
        <div className={styles.details}>
          <div>
            <h3 className={cn(styles.title, "line-clamp")}>
              {profileData ? (
                <Link
                  className="link"
                  href={`/${profileData.slug}/${release.release_slug}`}
                >
                  {release.title}
                </Link>
              ) : (
                release.title
              )}
            </h3>
            <div className={cn(styles.artist, "line-clamp")}>
              {release.artist}
            </div>
            <div className={cn(styles.label, "line-clamp")}>
              {release.label}
            </div>
            {release.type && release.type != "Choose release type" ? (
              <div className={styles.type}>
                <IconRecord aria-hidden="true" /> {release.type}
                {release.release_date
                  ? ` - ${releaseDate.getFullYear()}`
                  : null}
              </div>
            ) : null}
          </div>
          <div
            className={cn(
              styles.codes,
              release.codes[0].count <= 0 && styles.empty
            )}
          >
            <IconDownload aria-label="Available download codes" />
            {release.codes[0].count}{" "}
            <small style={{ fontWeight: "normal" }}>left</small>
          </div>
        </div>
      </div>
      {user ? (
        user.id === release.user_id ? (
          <div className={cn(styles.actions, "cluster")}>
            <UpdateRelease
              setShowReleaseUpdateView={setShowReleaseUpdateView}
              release={release}
              getProfile={getProfile}
              profileData={profileData}
            />
            <AddCodes
              userId={release.user_id}
              releaseId={release.id}
              setOnCodeAdded={setOnCodeAdded}
              profileData={profileData}
            />

            {profileData.is_subscribed || profileData.dlcm_friend ? (
              <>
                <ReleaseStats release={release} />
                <label
                  className={cn(styles.activeToggle, "label checkbox")}
                  htmlFor={`${release.id}isActive`}
                >
                  <span>Active</span>
                  <input
                    className="input"
                    id={`${release.id}isActive`}
                    type="checkbox"
                    checked={isActive}
                    onChange={() => showRelease(!isActive)}
                  />
                </label>
              </>
            ) : null}
          </div>
        ) : null
      ) : null}
    </div>
  )
}

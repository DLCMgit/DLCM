import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import SocialSites from "../SocialSites/SocialSites"
import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import ReleaseSort from "../ReleaseSort/ReleaseSort"

// const sortByCreatedAt = (a, b) => (a.created_at > b.created_at ? 1 : -1)
// const sortByTitle = (a, b) => (a.title > b.title ? 1 : -1)

// const filterOptions = [
//   {
//     label: "Oldest First",
//     value: "oldest",
//     method: sortByCreatedAt,
//     direction: "asc",
//   },
//   {
//     label: "Newest First",
//     value: "newest",
//     method: sortByCreatedAt,
//     direction: "desc",
//   },
//   { label: "A to Z", value: "a-z", method: sortByTitle, direction: "asc" },
//   { label: "Z to A", value: "z-a", method: sortByTitle, direction: "desc" },
// ]

export default function ProfileLayout({
  avatar,
  name,
  location,
  releases,
  profileSlug,
  sites,
  pagePassword,
  isPasswordProtected,
  aboutBlurb,
  isSubscribed,
  isDlcmFriend,
}) {
  const [artwork, setArtwork] = useState(avatar)
  const [password, setPassword] = useState()
  const [authorized, setAuthorized] = useState(
    isPasswordProtected ? false : true
  )
  const [showError, setShowError] = useState(false)
  const [sortedReleases, setSortedReleases] = useState(releases)

  function handleSubmit(e) {
    e.preventDefault()
    if (pagePassword == password) {
      setAuthorized(true)
    } else {
      setPassword("")
      setShowError(true)
    }
  }

  return (
    <>
      <Head>
        <title>{`${name}'s public profile`}</title>
        <meta
          property="og:title"
          content={`${name}'s public profile`}
          key="title"
        />
        <meta
          property="og:description"
          content={`See all of ${name}'s available releases`}
          key="description"
        />
      </Head>

      <>
        <div className={styles.wrapper}>
          <div className={cn(styles.profile, "container")}>
            {avatar ? (
              <img
                src={artwork}
                alt={name}
                width={200}
                height={200}
                onError={() => setArtwork("/DLCM_Default_Image.png")}
              />
            ) : (
              <img
                src="/DLCM_Default_Image.png"
                alt={name}
                width={200}
                height={200}
              />
            )}
            <div className={cn(styles.info, "stack", "block-overflow")}>
              <div>
                <div className={cn(styles.name)}>
                  <h1>{name}</h1>
                </div>
                <div className={cn(styles.location)}>
                  <h2>{location}</h2>
                </div>
                <div className={cn(styles.blurb)}>
                  <p>{aboutBlurb}</p>
                </div>
              </div>
              <SocialSites
                sites={sites}
                isSubscribed={isSubscribed}
                isDlcmFriend={isDlcmFriend}
              />
            </div>
          </div>
        </div>
        {!authorized ? (
          <div className={styles.wrapper}>
            <form
              className="container inline-max center-stage stack"
              style={{
                "--max-inline-size": "400px",
              }}
              onSubmit={handleSubmit}
            >
              <label htmlFor="password">Enter page password</label>

              <input
                className="input"
                id="password"
                type="password"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Submit</button>
              {showError ? (
                <p style={{ color: "red" }}>Incorrect password. Try Again.</p>
              ) : null}
            </form>
          </div>
        ) : (
          <>
            {isSubscribed || isDlcmFriend ? (
              <ReleaseSort
                releases={releases}
                setSortedReleases={setSortedReleases}
              />
            ) : null}
            <ul className="grid" role="list">
              {sortedReleases.map((release, index) =>
                release.is_active ? (
                  <li key={index}>
                    <Link
                      className={styles.release}
                      href={`/${profileSlug}/${release.release_slug}`}
                      style={{
                        textDecoration: "none",
                        color: "var(--text-1)",
                      }}
                    >
                      <ReleaseCard
                        key={release.id}
                        release={release}
                        profileSlug={profileSlug}
                      />
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </>
        )}
      </>
    </>
  )
}

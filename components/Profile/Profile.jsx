import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import SocialSites from "../SocialSites/SocialSites"
import { useState, useRef, useCallback } from "react"
import Head from "next/head"
import Link from "next/link"
import Pagination from "../Pagination/Pagination"
import Image from "next/image"
import ReleaseRefinement from "../ReleaseRefinement/ReleaseRefinement"

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
  const releasesPerPage = 10
  const filtersRef = useRef(null)
  const [password, setPassword] = useState()
  const [pageChange, setPageChange] = useState(0)
  const [authorized, setAuthorized] = useState(isPasswordProtected)
  const [showError, setShowError] = useState(false)
  const [refinedReleases, setRefinedReleases] = useState(releases)
  const pageCount = Math.ceil(refinedReleases.length / releasesPerPage)
  const [releasesOffset, setReleasesOffset] = useState(0)
  const endOffset = releasesOffset + releasesPerPage
  const currentReleases = refinedReleases.slice(releasesOffset, endOffset)

  const handlePageClick = () => {
    filtersRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handlePageChange = useCallback(
    (e) => {
      const newOffset = (e.selected * releasesPerPage) % releases.length
      setReleasesOffset(newOffset)
      setPageChange(e.selected)
    },
    [releases.length]
  )

  const handleFilterRefinement = useCallback(
    (releases) => {
      setRefinedReleases(releases)
      handlePageChange({ selected: 0 })
    },
    [handlePageChange]
  )

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (pagePassword === password) {
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

      <div className={cn(styles.wrapper, "stack inline-max")}>
        <Image
          className={styles.avatar}
          src={avatar || "/default-image.png"}
          alt={name}
          width={200}
          height={200}
        />
        <div className={cn(styles.info, "stack")}>
          <h1 className={cn(styles.name, "text-3")}>{name}</h1>
          <p className={cn(styles.location, "text-2")}>{location}</p>
          <p className={cn(styles.blurb)}>{aboutBlurb}</p>
          <SocialSites
            sites={sites}
            isSubscribed={isSubscribed}
            isDlcmFriend={isDlcmFriend}
          />
        </div>
      </div>

      {!authorized ? (
        <div className={styles.wrapper}>
          <form
            className="container inline-max stack"
            style={{
              "--max-inline-size": "45ch",
            }}
            onSubmit={handlePasswordSubmit}
          >
            <label htmlFor="password">Enter page password</label>

            <input
              className="input"
              id="password"
              type="password"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button" data-variant="primary" type="submit">
              Submit
            </button>
            {showError ? <p>Incorrect password. Try Again.</p> : null}
          </form>
        </div>
      ) : (
        <>
          <ReleaseRefinement
            ref={filtersRef}
            releases={releases}
            isVisible={isSubscribed || isDlcmFriend}
            onRefinement={handleFilterRefinement}
          />

          <ul className="grid" role="list">
            {currentReleases.map((release, index) =>
              release.is_active ? (
                <li key={index}>
                  <Link
                    className={styles.release}
                    href={`/${profileSlug}/${release.release_slug}`}
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
          <Pagination
            className={styles.pagination}
            forcePage={pageChange}
            onClick={handlePageClick}
            onPageChange={handlePageChange}
            pageCount={pageCount}
          />
        </>
      )}
    </>
  )
}

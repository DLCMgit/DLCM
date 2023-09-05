import slugify from "slugify"
import { useState, useEffect, useRef } from "react"
import { useUser } from "@supabase/auth-helpers-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AddImage from "@/components/AddImage/AddImage"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"
import Avatar from "../Avatar/Avatar"
import PopoverTip from "../PopoverTip/PopoverTip"
import { prependProtocol } from "@/utils/utils"
import InputPasswordProtect from "../InputPasswordProtect/InputPasswordProtect"
import InputReleaseType from "../InputReleaseType/InputReleaseType"
import InputSocialSites from "../InputSocialSites/InputSocialSites"
import InputIsActive from "../InputIsActive/InputIsActive"
import InputReleaseAbout from "../InputReleaseAbout/InputReleaseAbout"

export default function CreateRelease({
  trigger,
  setAddedNewRelease,
  profileData,
}) {
  const user = useUser()
  const supabase = createClientComponentClient()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState()
  const [sluggedName, setSluggedName] = useState("")
  const [firstSlugCheck, setFirstSlugCheck] = useState(false)
  const [namesTaken, setNamesTaken] = useState({
    color: "transparent",
    message: "",
  })
  const [noGO, setNoGO] = useState(true)
  const [artist, setArtist] = useState(
    profileData.type == "artist" ? profileData.username : ""
  )
  const [label, setLabel] = useState(
    profileData.type == "label" ? profileData.username : ""
  )
  const [artworkUrl, setArtworkUrl] = useState()
  const [yumUrl, setYumUrl] = useState(profileData.yum_url)
  const [pagePassword, setPagePassword] = useState()
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [type, setType] = useState()
  const [newImagePath, setNewImagePath] = useState()
  const [isActive, setIsActive] = useState(true)
  const [sites, setSites] = useState()
  const [releaseDate, setReleaseDate] = useState()
  const [about, setAbout] = useState()

  const resetForm = () => {
    setTitle()
    setSluggedName("")
    setFirstSlugCheck(false)
    setNoGO(true)
    setArtworkUrl()
    setPagePassword()
    setIsPasswordProtected(false)
    setType()
    setNewImagePath()
    setIsActive(true)
    setNamesTaken({
      color: "transparent",
      message: "",
    })
    setSites()
    setReleaseDate()
    setAbout()
  }

  const checkName = async (e) => {
    e.preventDefault()
    if (sluggedName.length == 0) {
      setNamesTaken({ color: "red", message: "Release must have a slug" })
      setNoGO(true)
    }
    if (sluggedName.length > 0) {
      if (firstSlugCheck == false) {
        setFirstSlugCheck(true)
      }
      setSluggedName(slugify(sluggedName))
      let { data, error } = await supabase
        .from("releases")
        .select("*")
        .eq("user_id", user.id)
        .eq("release_slug", sluggedName)

      if (data.length > 0) {
        setNamesTaken({ color: "red", message: "Urls taken, try again" })
        setNoGO(true)
      } else if (data.length == 0) {
        setNamesTaken({
          color: "green",
          message: "This url is available, snag it!",
        })
        setNoGO(false)
      }

      if (error) throw error
    }
  }

  async function createNewRelease() {
    try {
      let newRelease = {
        title: title,
        artist: artist,
        label: label,
        artwork_url: artworkUrl,
        artwork_path: newImagePath,
        yum_url: prependProtocol(yumUrl),
        type: type ? type : null,
        sites: sites,
        is_active: isActive,
        is_password_protected: isPasswordProtected,
        release_slug: sluggedName,
        release_date: releaseDate,
        about: about,
        user_id: user.id,
      }
      const { data, error } = await supabase
        .from("releases")
        .insert([newRelease])
      if (error) throw error
      alert("New release created!")
    } catch (error) {
      alert("Error creating new release!")
    } finally {
      setAddedNewRelease(true)
      resetForm()
      setOpen(false)
    }
  }

  async function cancelCreate() {
    if (newImagePath) {
      try {
        let { error } = await supabase.storage
          .from("images")
          .remove([newImagePath])
        if (error) alert(error)
      } catch (error) {
        throw error
      }
    }
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <header>
          <h2 className="text-3">Create new release</h2>
        </header>

        <div className="stack block-overflow">
          <label className="label">Artwork</label>
          <Avatar url={artworkUrl} size={250} />
          <AddImage
            uid={user.id}
            setPublicUrl={(url) => {
              setArtworkUrl(url)
            }}
            setNewImagePath={setNewImagePath}
          />
          <br />
          <p>* Denotes Required</p>
          <label className="label" htmlFor="title">
            Title*
          </label>
          <input
            className="input"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onInput={
              firstSlugCheck
                ? null
                : (e) =>
                    setSluggedName(slugify(e.target.value, { lower: true }))
            }
            onBlur={firstSlugCheck ? null : checkName}
          />

          <div className="input-wrapper">
            <label htmlFor="slug">Release slug*</label>
            <PopoverTip
              message={`This is where you will send your fans. Release slugs are unique to you, so no two can be named the same. If you do have multiple releases with the same name, add an identifier such as the release year to the slug.`}
            />
            <input
              className="input"
              onChange={(e) => setSluggedName(e.target.value)}
              id="slug"
              type="text"
              value={
                sluggedName
                  ? slugify(sluggedName, { lower: true, trim: false })
                  : sluggedName
              }
              onBlur={checkName}
            />
          </div>
          <small className="hint">
            Public address:{" "}
            <code>
              {process.env.NEXT_PUBLIC_DLCM_URL}
              {profileData.slug}
              {`/${sluggedName}`}
            </code>
          </small>
          <br />
          <small style={{ color: `${namesTaken.color}` }}>
            {namesTaken.message}
          </small>

          <label className="label" htmlFor="artist">
            Artist*
          </label>
          <input
            className="input"
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />

          <label className="label" htmlFor="label">
            Label
          </label>
          <input
            className="input"
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          {/*<label className="label" htmlFor="artworkUrl">
            Artwork URL
          </label>
          <input
            className="input"
            id="artworkUrl"
            type="text"
            value={artworkUrl}
            onChange={(e) => setArtworkUrl(e.target.value)}
          />
          <p>Upload an image or paste an external link</p>*/}

          <InputReleaseType type={type} onChange={setType} />

          <label htmlFor="releaseDate" className="label">
            Release Date:
            <input
              className="input"
              id="releaseDate"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </label>

          <label className="label" htmlFor="yumUrl">
            Redemption (yum) Link
          </label>
          <input
            className="input"
            id="yumUrl"
            type="text"
            value={yumUrl}
            onChange={(e) => setYumUrl(e.target.value)}
          />
          <small class="hint">
            This is the link your customers will visit to redeem their code. It
            is usually <code>your-name.bandcamp.com/yum</code>.
          </small>

          <InputSocialSites
            sites={sites}
            setSites={setSites}
            hasProAccount={profileData.is_subscribed || profileData.dlcm_friend}
          />

          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <>
              <InputIsActive isActive={isActive} setIsActive={setIsActive}>
                Show Release
              </InputIsActive>
              <InputReleaseAbout about={about} setAbout={setAbout} />
              <InputPasswordProtect
                id="isPasswordProtected"
                isProtected={isPasswordProtected}
                pagePassword={pagePassword}
                setIsProtected={() =>
                  setIsPasswordProtected(!isPasswordProtected)
                }
                setPagePassword={(e) => setPagePassword(e.target.value)}
              >
                Password protect this page
              </InputPasswordProtect>
            </>
          ) : null}
        </div>

        <footer className="button-actions cluster">
          <button
            className="button"
            data-variant="primary"
            onClick={() => createNewRelease()}
            disabled={!title || noGO || !artist}
          >
            Create
          </button>
          <button className="button" onClick={() => cancelCreate()}>
            Cancel
          </button>
        </footer>
      </DialogContent>
    </Dialog>
  )
}

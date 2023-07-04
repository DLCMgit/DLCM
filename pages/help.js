import Link from "next/link"
import { useState } from "react"
import cn from "classnames"
import Head from "next/head"

export default function Help() {
  const [faq, setFaq] = useState(true)
  return (
    <>
      <Head>
        <title>DLCM FAQs</title>
        <meta property="og:title" content="DLCM FAQs" key="title" />
        <meta
          property="og:description"
          content="Find the answers to frequently asked questions, as well as a tutorial on how to get started with DLCM"
          key="description"
        />
      </Head>
      <section
        className="container stack inline-max center-stage"
        style={{ "--max-inline-size": "800px" }}
      >
        <div className="faq-section stack" id="faq-section">
          <h2>DLCM FAQs</h2>

          <Link href="#tutorial-section">
            <small>skip to tutorial</small>
          </Link>

          <h3>How Do I Get Started?</h3>
          <p>
            Getting started is easy. First, go to our{" "}
            <Link href="/signup">signup</Link> page and create a new account.
            Enter your email and choose a password. This is how you will log in
            to DLCM in the future.
          </p>
          <p>
            Next, choose what type of account you would like to have, either an
            artist or a label. You will notice that as you begin to fill in your
            artist/label name, the field below it also starts to fill in. This
            field is your artist/label slug, and that represents your
            public-facing profile on DLCM.
          </p>
          <p>
            For example, I just started a label named after my dogs, Franny and
            Rool Records. When I enter that into the label name field, the label
            slug auto-fills to franny-and-rool-records, and directly underneath
            that will be what your address on DLCM is -
            https://dlcm.app/franny-and-rool-records
          </p>
          <p>
            We will let you know if that URL is available, or if somebody has
            already claimed that name. If that&apos;s the case, you can keep
            Franny and Rool Records as your label name, and edit your slug to
            something like franny-and-rool-records-2, or
            franny-and-rool-records-llc. And don&apos;t worry about proper
            formatting, the slug field will do that for you automatically.
          </p>
          <p>
            Then click the signup button, and that&apos;s it! Welcome to the
            club.
          </p>
          <h3>What Do I Get With A Free Account?</h3>
          <p>
            A free account sets you up with a public page and the ability to
            upload two releases. A release can be anything from a single to an
            LP. You are also able to upload as many codes as you want for both
            of those releases, as well as upload the artwork for each. (Artwork
            must be less than 1MB)
          </p>
          <h3>What Do I Get With A Pro Account?</h3>
          <p>
            A pro account gives you access to a few features in addition to the
            free stuff. First, you aren&apos;t limited to just two releases, you
            can have as many as you like. You also get to display any other
            services you or the release is on, such as bandcamp/spotify/apple
            music/etc. You also are able to set those releases to inactive,
            meaning that they won&apos;t show up if a user goes to your
            artist/label page, and will say that there are no codes available on
            the releases page. In addition to setting active/inactive, you are
            also able to password-protect these pages.
          </p>

          <p>
            Another feature included with a pro account is the ability to change
            your public profile address or slug. However, changing this will
            make the previous address show a page not found error. Make sure you
            tell all of your fans before making this change.
          </p>

          <p>
            The last feature of the pro account is the ability to upload
            bandcamp .csv files for code upload instead of copying and pasting.
            Please be advised that this only works with .csv files provided by
            bandcamp, and other .csv files will result in an error.
          </p>
          <h3>What Happens if I Cancel My Pro Account?</h3>
          <p>
            We would be very sad, but if you decide that the pro account is not
            for you, you will keep the service until the end of your billing
            cycle. After that, your two newest releases will be saved, while all
            other releases and codes associated with them will be removed from
            our system. You will also no longer have any of the other perks that
            come with a pro account.
          </p>
        </div>
        <div className="tutorial-section stack" id="tutorial-section">
          <h2>DLCM First Tutorial</h2>
          <small>
            <Link href="#faq-section">back to faq</Link>
          </small>
          <p>
            Welcome to DLCM. The following are just a few suggestions about what
            you should do once you have created your account.
          </p>
          <p>
            <strong>Update your profile</strong> - Upload an avatar and add your
            redemption link and location.
          </p>

          <p>
            <strong>Create your first release</strong> - Click the create new
            release button and enter your release information. Click create to
            add your first release.
          </p>

          <p>
            <strong>Add some codes</strong> - Now that you have a release, click
            the add codes button. Copy the codes from your file, and paste them
            into the text box. If you have the pro version, you could also add
            codes by uploading the bandcamp provided CSV file. When you click
            add, these codes will now be ready to be dispersed amongst your
            adoring fans. Great Job!
          </p>

          <p>
            That’s really all there is to it. As mentioned above, you can
            subscribe to our pro version for even more features and unlimited
            releases.
          </p>
        </div>
      </section>
    </>
  )
}

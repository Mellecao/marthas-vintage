/* eslint-disable @next/next/no-img-element */

const eyesCopy =
  "Martha’s eye is drawn first to color, then to the details that give a piece character: an unusual silhouette, fine handwork, a clever repair, or a textile with a life of its own. Each discovery is chosen for how it can be worn and loved now—warm, surprising and unmistakably personal.";

const collectionIntro =
  "The collection grows slowly, one thoughtful discovery at a time, guided by color, beautiful construction and honest wear.";

const collectionCopy =
  "Nothing is gathered simply because it is old. Each piece earns its place through character, usefulness and the chance to enter a new story. Together, the finds become a living archive—curated with affection, curiosity and an instinct for the unexpected.";

const wardrobeLead =
  "For Martha, a wardrobe extends beyond the closet. A painted room, handmade textile and ornate frame belong to the same conversation.";

const wardrobeCopy =
  "Pattern meets pattern; humble objects sit beside refined ones; color carries a memory from one corner of a home to another. This is a world assembled through feeling rather than rules, where personal style becomes a way of living with the things that continue to surprise and delight us.";

function Texture() {
  return (
    <>
      <span className="redesign-paper" aria-hidden="true" />
      <span className="redesign-grunge" aria-hidden="true" />
    </>
84;}

function EditorialPhoto({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <figure className={`redesign-photo ${className}`}>
      <img src={src} alt={alt} />
      <span aria-hidden="true" />
    </figure>
  );
}

export function DesktopEditorialSections() {
  return (
    <div className="desktop-editorial desktop-redesign" aria-label="Martha's Vintage story">
      <header className="redesign-header">
        <nav aria-label="Primary navigation">
          <a href="#desktop-home">Home</a>
          <a href="#desktop-beyond">Beyond the wardrobe</a>
          <span className="redesign-header-logo" aria-label="Martha's Vintage">
            <img src="/assets/site/desktop-home/marthas-word.svg" alt="" />
            <img src="/assets/site/desktop-home/vintage-word.svg" alt="" />
          </span>
          <a href="#desktop-marthas-eyes">The martha’s eyes</a>
          <a href="#desktop-contact">Contact</a>
        </nav>
      </header>

      <div className="redesign-stack">
        <section
          id="desktop-marthas-eyes"
          className="redesign-card redesign-eyes"
          aria-labelledby="redesign-eyes-title"
        >
          <Texture />
          <div className="redesign-card-folio" aria-hidden="true">No. 01 — The point of view</div>
          <div className="redesign-eyes-copy">
            <p className="redesign-eyebrow">The Martha’s</p>
            <div className="redesign-eyes-heading">
              <h2 id="redesign-eyes-title">eyes</h2>
              <span aria-hidden="true">
                <img src="/assets/site/eye.svg" alt="" />
                <img src="/assets/site/eye.svg" alt="" />
              </span>
            </div>
            <p className="redesign-torn-note">{eyesCopy}</p>
          </div>
          <EditorialPhoto
            className="redesign-eyes-photo"
            src="/assets/site/store-landscape.png"
            alt="Martha's shop filled with vintage clothing, textiles and collected objects"
          />
          <p className="redesign-photo-caption">Bastrop, Texas · objects chosen with instinct, never by formula</p>
        </section>

        <section
          id="desktop-collection"
          className="redesign-card redesign-collection"
          aria-labelledby="redesign-collection-title"
        >
          <Texture />
          <div className="redesign-section-heading">
            <p>Archive / Clothing / Beautiful oddities</p>
            <h2 id="redesign-collection-title"><span>The</span> collection</h2>
            <b aria-hidden="true">02</b>
          </div>

          <div className="redesign-collection-grid">
            <EditorialPhoto
              className="redesign-collection-main"
              src="/assets/site/store-landscape.png"
              alt="A closer view of racks, a vintage chair and hand-picked objects"
            />
            <blockquote>
              <span>curated,</span>
              <strong>not accumulated</strong>
            </blockquote>
            <EditorialPhoto
              className="redesign-collection-detail"
              src="/assets/site/store-landscape.png"
              alt="The colorful interior of Martha's Vintage"
            />
          </div>

          <div className="redesign-collection-text">
            <p className="redesign-torn-note">{collectionIntro}</p>
            <p>{collectionCopy}</p>
          </div>
        </section>

        <section
          id="desktop-beyond"
          className="redesign-card redesign-beyond"
          aria-labelledby="redesign-beyond-title"
        >
          <Texture />
          <div className="redesign-beyond-lockup">
            <span aria-hidden="true" />
            <img id="redesign-beyond-title" src="/assets/SVG/wardrobe.svg" alt="Beyond the wardrobe" />
            <span aria-hidden="true" />
          </div>
          <p className="redesign-beyond-deck">Clothing, art and interiors belong in the same conversation.</p>

          <div className="redesign-beyond-grid">
            <EditorialPhoto
              className="redesign-room"
              src="/assets/site/beyond-room.jpeg"
              alt="A richly layered bedroom with vintage textiles, furniture and art"
            />
            <p className="redesign-torn-note redesign-beyond-lead">{wardrobeLead}</p>
            <EditorialPhoto
              className="redesign-art"
              src="/assets/site/beyond-art.jpeg"
              alt="Two framed needlepoint portraits from Martha's collection"
            />
          </div>

          <div className="redesign-beyond-footer">
            <span>Home as a personal collection</span>
            <p>{wardrobeCopy}</p>
          </div>
        </section>
      </div>

      <span id="desktop-contact" className="desktop-contact-anchor" aria-hidden="true" />
    </div>
  );
}

export default function StudioHelp() {
  return (
    <div className="studio-help">
      <h3>How the studio works</h3>
      <ol className="studio-help-list">
        <li>
          <strong>Choose a picture.</strong> Drop a file or paste an image link in the dock at the
          bottom of the studio. This becomes a <em>draft</em> — nothing is published yet.
        </li>
        <li>
          <strong>Publish it.</strong> The yellow <strong>Publish</strong> button saves the picture
          and makes its QR code live. If you already have a picture on the canvas, publishing
          <em>replaces</em> it and the QR code stays the same.
        </li>
        <li>
          <strong>Scan or share.</strong> The QR code on the right opens the public viewing page.
          Download the PNG, copy the link or click the QR code to enlarge it.
        </li>
        <li>
          <strong>Replace later.</strong> Choose a new picture while the old one is on the canvas.
          Publishing keeps the same QR code, so anything you already printed keeps working.
        </li>
        <li>
          <strong>Multiple codes.</strong> Use <em>Pictures → Publish as new QR code</em> to create
          a brand-new picture with its own separate code.
        </li>
      </ol>
      <h3>Picture rules</h3>
      <ul className="studio-help-rules">
        <li>JPEG, PNG, WebP or GIF, up to 15&nbsp;MB.</li>
        <li>Images are resized in the browser to a maximum of 1400&nbsp;px before publishing.</li>
        <li>
          You can also paste a public image URL instead of uploading a file.
        </li>
      </ul>
      <h3>If something looks wrong</h3>
      <p className="hint">
        A yellow banner means the app is in local demo mode or the QR code points at localhost —
        phones will not be able to open those codes until the app is deployed publicly. See the
        README for deployment steps.
      </p>
    </div>
  );
}

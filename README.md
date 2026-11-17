# Eyes of Ethics

Static photography portfolio for GitHub Pages. Open `index.html` in a browser or use your VS Code local preview. The site needs no build or package installation.

## Files

- `index.html` contains the hero, gallery entries, sessions, and inquiry fields.
- `styles.css` contains the layout, type, colors, and responsive rules.
- `site.js` handles category filters, the photo viewer, checkout links, and inquiry submission.
- `config.js` holds the public Square links and inquiry endpoint.
- `assets/` holds small WebP thumbnails and larger WebP photos. Keep source originals separately.

## Add the second photo batch

Export a thumbnail around 600 px wide and a larger preview around 1440 px wide. Add the files under `assets/`. Copy a gallery `figure` in `index.html`. Set the image link to the large preview, the image source to the thumbnail, and describe the picture in its alt text. Set the category to Portraits, Editorial, Live & Events, or Cosplay. The filter and viewer pick up new entries automatically. The display titles and categories in this draft can be updated with Ethics.

## Set up Square

1. Confirm which fixed-price packages or products Ethics wants available for checkout and what each includes.
2. In his Square Dashboard, open Payment Links and create a **Sell an item** link for each approved item.
3. Add each approved label and public hosted checkout URL to `quickOrders` in `config.js`. Each offer can include a description. The checkout section is always visible, and the offer cards appear as you add links. The accepted hostnames are `square.link` and `checkout.square.site`.
4. Open every link to verify the product and price. A payment link alone does not reserve a date. Use an inquiry and date confirmation for custom shoots.

[Square Payment Links instructions](https://squareup.com/help/us/en/article/6692-get-started-with-square-checkout-links)

### Square Developer setup

For offers created through the Square Developer account, use the Checkout API's Create Payment Link endpoint with Ethics’s Square location, an approved offer name and price, and an idempotency key unique to that offer creation. Test in Sandbox first. Create production links through Square’s authenticated developer tooling or a server you control. Use the returned public `payment_link.url` in `quickOrders`. Keep access tokens and other credentials in the authenticated Square environment.

```js
{
    label: 'Approved offer name and price',
    description: 'What the offer includes',
    url: 'https://square.link/u/REPLACE_WITH_ETHICS_LINK',
}
```

[Square Developer Checkout API](https://developer.squareup.com/reference/square/checkout/create-payment-link)

## Connect inquiries

The inquiry form is visible from the start. Its Send inquiry button activates when a delivery endpoint is configured. A hosted form service can accept submissions from the static site and notify Ethics. Formspree is an option. Create a form, configure and verify the recipient in the provider's dashboard, then paste its HTTPS endpoint into `inquiryEndpoint` in `config.js`. The included handler expects a cross-origin multipart POST and a successful JSON response with `ok: true`. If using a different response contract, update the success check in `site.js`. Once connected, submit a test from the deployed domain and confirm delivery in Ethics's inbox. Keep credentials and API keys out of the site files.

[Formspree form documentation](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/)

## Publish to GitHub Pages and point Cloudflare DNS

1. Put the contents of this folder at the root of the intended GitHub repository, including `.nojekyll`.
2. In **Settings → Pages**, select **Deploy from a branch**, then select the publishing branch and **/(root)**. Open the default Pages URL to verify the deployment.
3. Verify the intended domain in GitHub with the requested TXT record in Cloudflare. Set the custom domain in the repo's Pages settings before pointing the site's DNS records at GitHub.
4. Add the DNS records GitHub documents for the chosen apex or subdomain in Cloudflare. Preserve any existing mail records. Once the DNS check passes and the certificate is ready, enable **Enforce HTTPS** in GitHub Pages.
5. Verify navigation, project photos, checkout links, and inquiry delivery from the actual public URL.

[GitHub Pages custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## Accessibility checks before launch

The site uses WCAG 2.2 AA as its accessibility target. The gallery links open the larger images directly when JavaScript is unavailable. With JavaScript, Tab reaches the filters and viewer controls, Enter opens an image, arrow keys navigate, and Escape closes the viewer and returns focus to its trigger.

Verify the deployed site with keyboard navigation and Safari VoiceOver. Repeat the inquiry and Square checkout flow once the live services are connected. Review the whole booking path for WCAG conformance before making any compliance claim.

## 📜 $\textsf{\color{salmon}{List\ of\ updates}}$

### $\textsf{\color{skyblue}2026/03/22}$

$\textsf{[v1.5.3\ =>\ {\textbf{\color{brown}v1.5.6}]}}$ app
- $\textsf{\color{black}Deletion:}$ Deleted files related to the docker configuration.
- $\textsf{\color{orange}Patch:}$ Updated:
  + fn reset(...) (support component) does not change support option on manual reset.
  + extracted fn scrollToTop(...) to navigation service.

<br>

### $\textsf{\color{skyblue}2026/03/15}$

$\textsf{[v1.4.3\ =>\ v1.5.3]}$ app
- $\textsf{\color{teal}Addition:}$ Added new service to validate and handle file attachments.
- $\textsf{\color{orange}Patch:}$ Updated (support component):
  + responsive design and detection for device suggestion.
  + validations and notification on invalid send action.
  + value change for optional data on request send.

<br>

### $\textsf{\color{skyblue}2026/02/24}$

$\textsf{[v1.3.4\ =>\ v1.4.3]}$ app
- $\textsf{\color{teal}Addition:}$ Added new 'support' component including selection of mode for bug/feedback/support.
- $\textsf{\color{teal}Addition:}$ Added new 'star-rating' module for feedback rating purposes.
- $\textsf{\color{orange}Patch:}$ Updated support api, interfaces as well as some styling and validation of other modules (textarea, button).
- $\textsf{\color{orange}Patch:}$ Updated 'imprint' page linking to 'support' page instead showing email address.

<br>

### $\textsf{\color{skyblue}2026/02/19}$

$\textsf{[v1.3.2\ =>\ v1.3.4]}$ app
- $\textsf{\color{teal}Addition:}$ Added translations, basic api service & UI component for upcoming new feature (support).
- $\textsf{\color{orange}Patch:}$ Updated http interceptor & obersavation service for upcoming new feature (support).

<br>

### $\textsf{\color{skyblue}2026/02/16}$

$\textsf{[v1.3.1\ =>\ v1.3.2]}$ app
- $\textsf{\color{orange}Patch:}$ Updated 'about' page in styling and embedded youtube video link.

<br>

### $\textsf{\color{skyblue}2026/01/30}$

$\textsf{[v1.3.0\ =>\ v1.3.1]}$ app
- $\textsf{\color{orange}Patch:}$ Updated snackbar service avoid displaying same errors multiple times.

<br>

### $\textsf{\color{skyblue}2026/03/15}$

$\textsf{[v1.4.3\ =>\ {\textbf{\color{brown}v1.5.3}]}}$ app
- $\textsf{\color{teal}Addition:}$ Added new service to validate and handle file attachments.
- $\textsf{\color{orange}Patch:}$ Updated (support component):
  + responsive design and detection for device suggestion.
  + validations and notification on invalid send action.
  + value change for optional data on request send.

<br>

### $\textsf{\color{skyblue}2026/02/24}$

$\textsf{[v1.3.4\ =>\ v1.4.3]}$ app
- $\textsf{\color{teal}Addition:}$ Added new 'support' component including selection of mode for bug/feedback/support.
- $\textsf{\color{teal}Addition:}$ Added new 'star-rating' module for feedback rating purposes.
- $\textsf{\color{orange}Patch:}$ Updated support api, interfaces as well as some styling and validation of other modules (textarea, button).
- $\textsf{\color{orange}Patch:}$ Updated 'imprint' page linking to 'support' page instead showing email address.

<br>

### $\textsf{\color{skyblue}2026/02/19}$

$\textsf{[v1.3.2\ =>\ v1.3.4]}$ app
- $\textsf{\color{teal}Addition:}$ Added translations, basic api service & UI component for upcoming new feature (support).
- $\textsf{\color{orange}Patch:}$ Updated http interceptor & obersavation service for upcoming new feature (support).

<br>

### $\textsf{\color{skyblue}2026/02/16}$

$\textsf{[v1.3.1\ =>\ v1.3.2]}$ app
- $\textsf{\color{orange}Patch:}$ Updated 'about' page in styling and embedded youtube video link.

<br>

### $\textsf{\color{skyblue}2026/01/30}$

$\textsf{[v1.3.0\ =>\ v1.3.1]}$ app
- $\textsf{\color{orange}Patch:}$ Updated snackbar service avoid displaying same errors multiple times.

<br>

### $\textsf{\color{skyblue}2026/01/28}$

$\textsf{[v1.2.13\ =>\ v1.3.0]}$ app<br>
$\textsf{[v1.4.0\ =>\ {\textbf{\color{brown}v1.4.1}]}}$ database
- $\textsf{\color{teal}Addition:}$ Added new feature:
  + artworks are displayed in gallery (detail view) with different frames
  + frames can be selected by admin from list of different models
  + frames can be modified by admin via color-picker
  + selected frames are visible on admin preview/detail view
- $\textsf{\color{orange}Patch:}$ Added migration to update 'gallery' table by adding 'art_frame_model' and 'art_frame_color' properties.

<br>

### $\textsf{\color{skyblue}2026/01/25}$

$\textsf{[v1.2.12\ =>\ v1.2.13]}$ app
- $\textsf{\color{orange}patch:}$ Updated to display gallery first time without selected genre and no images. A selected genre will be stored in local storage of browser until end of the day.

<br>

### $\textsf{\color{skyblue}2026/01/09}$

$\textsf{[v1.2.11\ =>\ v1.2.12]}$ app
- $\textsf{\color{teal}Addition:}$ Added new sale status "sold" for gallery artworks.

<br>

### $\textsf{\color{skyblue}2025/11/13}$

$\textsf{[v1.2.10\ =>\ v1.2.11]}$ app
- $\textsf{\color{orange}Patch:}$ Updated documentation formatting.

<br>

### $\textsf{\color{skyblue}2025/10/30}$

$\textsf{[v1.2.8\ =>\ v1.2.10]}$ app
- $\textsf{\color{orange}Patch:}$ Updated admin search function to search on every change automatically and reset with empty input.
- $\textsf{\color{red}Bugfix:}$ Admin search function works again as expected. [Before: Text search returned empty list every time due to syntax error.]

<br>

### $\textsf{\color{skyblue}2025/08/27}$

$\textsf{[v1.2.7\ =>\ v1.2.8]}$ app<br>
$\textsf{[v1.3.1\ =>\ v1.4.0]}$ database
- $\textsf{\color{teal}Addition:}$ Added route to request meta data of application.

<br>

### $\textsf{\color{skyblue}2025/08/25}$

$\textsf{[v1.2.6\ =>\ v1.2.7]}$ app
- $\textsf{\color{teal}Addition:}$ Added staging environment & jest testing framework.

<br>

### $\textsf{\color{skyblue}2025/07/31}$

$\textsf{[v1.2.5\ =>\ v1.2.6]}$ app<br>
$\textsf{[v1.3.0\ =>\ v1.3.1]}$ database
- $\textsf{\color{teal}Addition:}$ Added new sale status 'reserved'.

<br>

### $\textsf{\color{skyblue}2025/06/22}$

$\textsf{[v1.2.4\ =>\ v1.2.5]}$ app
- $\textsf{\color{orange}Patch:}$ Refactored html tags to better fit content.
- $\textsf{\color{orange}Patch:}$ Added link of new exhibition partner to footer.

<br>

### $\textsf{\color{skyblue}2025/06/09}$

$\textsf{[v1.2.1\ =>\ v1.2.4]}$ app
- $\textsf{\color{orange}Patch:}$ Updated logout background in administration dashboard by using .svg file instead SCSS code. Additionally, the background is set fitting to dark or light mode theme.
- $\textsf{\color{orange}Patch:}$ Added automatic logout by checking token expiration.
- $\textsf{\color{red}Bugfix:}$ Image Upload of same image multiple times in a row is now correctly validated on each use. [Before: After first use, the same image was not validated anymore on image upload via explorer select (ElementRef did not trigger if value/files did not changed due to same image).]

<br>

### $\textsf{\color{skyblue}2025/06/05}$

$\textsf{[v1.1.1\ =>\ v1.2.1]}$ app<br>
$\textsf{[v1.2.0\ =>\ v1.3.0]}$ database
- $\textsf{\color{orange}Patch:}$ Added new service "assets" to handle media data by admin. Home page will display art exhibition images in carousel underneath news slider.
- $\textsf{\color{red}Bugfix:}$ Hovering/scrolling in mobile mode does not change arrangement of artworks in gallery overview. [Before: Hovering/scrolling in mobile mode on certain viewport (artworks close to sides) changed total width of row and dropped one element into next row => every row x elements and in row of hovered element x - 1.]

<br>

### $\textsf{\color{skyblue}2025/05/21}$

$\textsf{[v1.1.0\ =>\ v1.1.1]}$ app
- $\textsf{\color{orange}Patch:}$ Added image preload service/guard to provide loaded images before showing page.

<br>

### $\textsf{\color{skyblue}2025/05/19}$

$\textsf{[v1.0.3\ =>\ v1.1.0]}$ app<br>
$\textsf{[v1.1.0\ =>\ v1.2.0]}$ database
- $\textsf{\color{orange}Patch:}$ Added administration of 'news' elements (create/update/delete).
- $\textsf{\color{orange}Patch:}$ Removed static json data to load 'news' elements.
- $\textsf{\color{orange}Patch:}$ Updated route highlighting (active navigation route has bolder font in navbar).
- $\textsf{\color{orange}Patch:}$ Added version check of image load (load from cache if possible or from cloud if outdated).

<br>

### $\textsf{\color{skyblue}2025/04/16}$

$\textsf{[v1.0.2\ =>\ v1.0.3]}$ app
- $\textsf{\color{orange}Patch:}$ Update email security by encrypting all payload data on mail request.
- $\textsf{\color{orange}Patch:}$ Update documentation from beta to current version status.

<br>

### $\textsf{\color{skyblue}2025/04/09}$

$\textsf{[v1.0.1\ =>\ v1.0.2]}$ app
- $\textsf{\color{orange}Patch:}$ Add logging service (framework winston) including BetterStack (Logtail => logs monitoring).
- $\textsf{\color{orange}Patch:}$ Add default snackbar message data for undefined exceptions.

<br>

### $\textsf{\color{skyblue}2025/04/05}$

$\textsf{[v1.0.0\ =>\ v1.0.1]}$ app
- $\textsf{\color{orange}Patch:}$ Change database host (NEON) setting to use server close to Austria for increase of loading speed.
- $\textsf{\color{orange}Patch:}$ Change setting to order results of listing all gallery entries by publication year and then on creation timestamp.

<br>

### $\textsf{\color{skyblue}2025/04/04}$

$\textsf{[v1.0.0-beta.15\ =>\ v1.0.0]}$ app
- $\textsf{\color{orange}Patch:}$ Add fullsize artwork as landing page background image.
- $\textsf{\color{orange}Patch:}$ Add secondary color for better highlighting.
- $\textsf{\color{orange}Patch:}$ Add image-preload to 'home', 'gallery', 'login' and 'admin' component (images with bigger size).
- $\textsf{\color{orange}Patch:}$ Exchanged .jpg with .webp format images on components with the added preload.

<br>

### $\textsf{\color{skyblue}2025/03/31}$

$\textsf{[v1.0.0-beta.14\ =>\ v1.0.0-beta.15]}$ app
- $\textsf{\color{orange}Patch:}$ Implement 'prints' and 'shipping' component including content and translations.
- $\textsf{\color{orange}Patch:}$ Add translations to 'imprint' and 'privacy' component.
- $\textsf{\color{orange}Patch:}$ Add content to 'about' component.

<br>

### $\textsf{\color{skyblue}2025/03/26}$

$\textsf{[v1.0.0-beta.13\ =>\ v1.0.0-beta.14]}$ app
- $\textsf{\color{orange}Patch:}$ Login form automatically sets cursor inside username input when loading component.
- $\textsf{\color{orange}Patch:}$ Navigating between gallery overview and gallery details (as guest user) uses preloaded data to avoid unnecessary loading delay (refresh or navigating with different previous route reloads content from database).

<br>

### $\textsf{\color{skyblue}2025/03/25}$

$\textsf{[v1.0.0-beta.12\ =>\ v1.0.0-beta.13]}$ app<br>
$\textsf{[v1.0.0\ =>\ v1.1.0]}$ database
- $\textsf{\color{orange}Patch:}$ Navigating to gallery overview/details (as guest user) shows up-to-date data loaded from database instead of static json data.
- $\textsf{\color{orange}Patch:}$ Landing page displays now legal license-free images in background with link to author.

<br>

### $\textsf{\color{skyblue}2025/03/23}$

$\textsf{[v1.0.0-beta.11\ =>\ v1.0.0-beta.12]}$ app
- $\textsf{\color{orange}Patch:}$ Add security layer for admin-only operations regarding access to routes and server requests only when admin is logged in.
- $\textsf{\color{red}Bugfix:}$ Creating a new gallery entry works as expected. [Before: Creating new gallery entry requests were denied only from mobile devices with hint on parameter error => github bug report recommends including flag to ignore error and continue process.]

<br>

### $\textsf{\color{skyblue}2025/03/19}$

$\textsf{[v1.0.0-beta.10\ =>\ v1.0.0-beta.11]}$ app
- $\textsf{\color{orange}Patch:}$ Add administration feature to login as Admin and manage gallery entries (including encryption, login via jwt, database and cloud storage).

<br>

### $\textsf{\color{skyblue}2024/11/02}$

$\textsf{[v1.0.0-beta.9\ =>\ v1.0.0-beta.10]}$ app
- $\textsf{\color{red}Bugfix:}$ Contact form displays all fields as expected before and after usage. [Before: After sending a request, the form would not display the fields 'price' and 'type' => specific reset was necessary.]
- $\textsf{\color{orange}Patch:}$ Removed scrollbar from 'gallery' page.
- $\textsf{\color{red}Bugfix:}$ Scroll-to-top works again as expected. [Before: Element 'scrollAnchor' got value assigned inside constructor which now leads to null and can't scroll to top => assign value inside ngOnInit lifecycle instead.]
- $\textsf{\color{red}Bugfix:}$ Sending an general request mail works as expected. [Before: Mail form was invalid for subject 'general request', because field 'type' was invalid due to no chosen reference-number and missing value of 'type' => validator gets removed in case of subject 'general request'.]

<br>

### $\textsf{\color{skyblue}2024/11/01}$

$\textsf{[v1.0.0-beta.8\ =>\ v1.0.0-beta.9]}$ app
- $\textsf{\color{orange}Patch:}$ Added dockerization and selected new hosting service. Working Backend functionality now available.

<br>

### $\textsf{\color{skyblue}2024/10/13}$

$\textsf{[v1.0.0-beta.7\ =>\ v1.0.0-beta.8]}$ app
- $\textsf{\color{teal}Addition:}$ New content (features) added to 'archive' component.
- $\textsf{\color{orange}Patch:}$ Issue: <a href="https://github.com/yqni13/artcreation-dv/issues/42">artdv-001</a>.
- $\textsf{\color{orange}Patch:}$ Addressing github dependabot alerts: adapted dependencies.
- $\textsf{\color{orange}Patch:}$ Adapted info data of developer in 'imprint' component.

<br>

### $\textsf{\color{skyblue}2024/10/03}$

$\textsf{[v1.0.0-beta.6\ =>\ v1.0.0-beta.7]}$ app
- $\textsf{\color{teal}Addition:}$ New content (features) added to 'gallery' component.
- $\textsf{\color{orange}Patch:}$ Added listener to en/disable contact form submit button to avoid unintended sending of same message multiple times.
- $\textsf{\color{orange}Patch:}$ Refactored de/en.json to work with placeholder variables for dynamic translations and added missing validation-message translations.
- $\textsf{\color{orange}Patch:}$ Renamed project and specific pre-selector to fit domain name later on.

<br>

### $\textsf{\color{skyblue}2024/09/29}$

$\textsf{[v1.0.0-beta.5\ =>\ v1.0.0-beta.6]}$ app
- $\textsf{\color{orange}Patch:}$ Adapted some translations.
- $\textsf{\color{orange}Patch:}$ Added dynamic setting of 'lang' attribute in index.html to avoid unwanted google translation.
- $\textsf{\color{teal}Addition:}$ New content (features) added to 'gallery' component.
- $\textsf{\color{red}Bugfix:}$ Ordering an artwork, available as original or print can be selected separetely in contact form. [Before: Ordering artwork available as orginal or print would fail the dropdown selection of 'type'.]

<br>

### $\textsf{\color{skyblue}2024/09/28}$

$\textsf{[v1.0.0-beta.4\ =>\ v1.0.0-beta.5]}$ app
- $\textsf{\color{orange}Patch:}$ Added navigation subscription to always get current and previous route from navigation service.
- $\textsf{\color{orange}Patch:}$ Added keylisteners to control carousel in 'home' component and scrolling/return inside the gallery.
- $\textsf{\color{orange}Patch:}$ In mobile version, gallery preview images are now always 3 images each row, adapting in size to fit row.
- $\textsf{\color{teal}Addition:}$ New content (features) added to 'gallery' component.
- $\textsf{\color{red}Bugfix:}$ All data get removed from contact form after navigating to other components. [Before: Reference number, used by 'request price' in 'gallery-details' component, stayed in contact form even after navigating to other components.]

<br>

### $\textsf{\color{skyblue}2024/09/25}$

$\textsf{[v1.0.0-beta.3\ =>\ v1.0.0-beta.4]}$ app
- $\textsf{\color{orange}Patch:}$ Added internationalization (i18n) to translate to english or german language.
- $\textsf{\color{orange}Patch:}$ Improved localstorage handling.
- $\textsf{\color{teal}Addition:}$ New content (features) added to README.

<br>

### $\textsf{\color{skyblue}2024/09/16}$

$\textsf{[v1.0.0-beta.2\ =>\ v1.0.0-beta.3]}$ app
- $\textsf{\color{orange}Patch:}$ Added customized preload/lazy loading to gallery.
- $\textsf{\color{orange}Patch:}$ Resized images to improve loading efficiency.
- $\textsf{\color{teal}Addition:}$ New content (features) added to README.

<br>

### $\textsf{\color{skyblue}2024/09/10}$

$\textsf{[v1.0.0-beta.1\ =>\ v1.0.0-beta.2]}$ app
- $\textsf{\color{orange}Patch:}$ Scrollbar set to include only scrollable content (excluding navbar in mobile mode).
- $\textsf{\color{orange}Patch:}$ Added scroll-to-top button on right bottom corner.
- $\textsf{\color{red}Bugfix:}$ Wrapped nav elements keep center alignment. [Before: Navigation elements that are wrapped didn't have center alignment and were displayed aligned to the left side.]

<br>

### $\textsf{\color{skyblue}2024/09/09}$

$\textsf{[v1.0.0-beta.alpha\ =>\ v1.0.0-beta.1]}$ app
- $\textsf{\color{orange}Patch:}$ Resized images to display smaller versions on previews / smaller displays (gallery detail / archive) and increase loading speed.
- $\textsf{\color{orange}Patch:}$ Return-to-gallery button in gallery details fixed in position to stay while scrolling.
- $\textsf{\color{red}Bugfix:}$ Responsive design of gallery details supports device resolutions for width (400px > x < 1800px) and height (400px > y < 1400px). [Before: Gallery details didn't support resolutions under 700px of height and scaled wrong.]
- $\textsf{\color{red}Bugfix:}$ Navigating to other page in menu resets scroll point to top position while maintaining scrollbar where its supposed to be visible (refresh gets back to current scroll position). [Before: Scroll position was reused for next page so that it didn't start at top and scrollbar worked or the other way around (both did not work simultaneously).]

<br>

### $\textsf{\color{skyblue}2024/09/07}$

$\textsf{[v1.0.0-alpha.8\ =>\ v1.0.0-beta.alpha]}$ app
- $\textsf{\color{teal}Addition:}$ New content added to gallery.
- $\textsf{\color{teal}Addition:}$ Basic structure of README.md added.
- $\textsf{\color{orange}Patch:}$ Run deployment via https//app.netlify.com host.
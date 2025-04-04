# yqni13 artcreation-dv

### $\texttt{\color{olive}{LIST\ OF\ UPDATES}}$

<br>

### 2024/04/04 - $\textsf{update\ 1.0.0-beta.15\ >>\ {\color{pink}1.0.0}}$

- $\textsf{\color{green}Change:}$ Add fullsize artwork as landing page background image.
- $\textsf{\color{green}Change:}$ Add secondary color for better highlighting.
- $\textsf{\color{green}Change:}$ Add image-preload to 'home', 'gallery', 'login' and 'admin' component (images with bigger size).
- $\textsf{\color{green}Change:}$ Exchanged .jpg with .webp format images on components with the added preload.

### 2024/03/31 - $\textsf{update\ 1.0.0-beta.14\ >>\ {\color{pink}1.0.0-beta.15}}$

- $\textsf{\color{green}Change:}$ Implement 'prints' and 'shipping' component including content and translations.
- $\textsf{\color{green}Change:}$ Add translations to 'imprint' and 'privacy' component.
- $\textsf{\color{green}Change:}$ Add content to 'about' component.

### 2024/03/26 - $\textsf{update\ 1.0.0-beta.13\ >>\ {\color{pink}1.0.0-beta.14}}$

- $\textsf{\color{green}Change:}$ Login form automatically sets cursor inside username input when loading component.
- $\textsf{\color{green}Change:}$ Navigating between gallery overview and gallery details (as guest user) uses preloaded data to avoid unnecessary loading delay (refresh or navigating with different previous route reloads content from database).

### 2024/03/25 - $\textsf{update\ 1.0.0-beta.12\ >>\ {\color{pink}1.0.0-beta.13}}$

- $\textsf{\color{green}Change:}$ Navigating to gallery overview/details (as guest user) shows up-to-date data loaded from database instead of static json data.
- $\textsf{\color{green}Change:}$ Landing page displays now legal license-free images in background with link to author.

### 2024/03/23 - $\textsf{update\ 1.0.0-beta.11\ >>\ {\color{pink}1.0.0-beta.12}}$

- $\textsf{\color{green}Change:}$ Add security layer for admin-only operations regarding access to routes and server requests only when admin is logged in.
- $\textsf{\color{red}Bugfix:}$ Creating a new gallery entry works as expected. [Before: Creating new gallery entry requests were denied only from mobile devices with hint on parameter error => github bug report recommends including flag to ignore error and continue process.]

### 2024/03/19 - $\textsf{update\ 1.0.0-beta.10\ >>\ {\color{pink}1.0.0-beta.11}}$

- $\textsf{\color{green}Change:}$ Add administration feature to login as Admin and manage gallery entries (including encryption, login via jwt, database and cloud storage).

### 2024/11/02 - $\textsf{update\ 1.0.0-beta.9\ >>\ {\color{pink}1.0.0-beta.10}}$

- $\textsf{\color{red}Bugfix:}$ Contact form displays all fields as expected before and after usage. [Before: After sending a request, the form would not display the fields 'price' and 'type' => specific reset was necessary.]
- $\textsf{\color{green}Change:}$ Removed scrollbar from 'gallery' page.
- $\textsf{\color{red}Bugfix:}$ Scroll-to-top works again as expected. [Before: Element 'scrollAnchor' got value assigned inside constructor which now leads to null and can't scroll to top => assign value inside ngOnInit lifecycle instead.]
- $\textsf{\color{red}Bugfix:}$ Sending an general request mail works as expected. [Before: Mail form was invalid for subject 'general request', because field 'type' was invalid due to no chosen reference-number and missing value of 'type' => validator gets removed in case of subject 'general request'.]

### 2024/11/01 - $\textsf{update\ 1.0.0-beta.8\ >>\ {\color{pink}1.0.0-beta.9}}$

- $\textsf{\color{green}Change:}$ Added dockerization and selected new hosting service. Working Backend functionality now available.

### 2024/10/13 - $\textsf{update\ 1.0.0-beta.7\ >>\ {\color{pink}1.0.0-beta.8}}$

- $\textsf{\color{teal}Addition:}$ New content (features) added to 'archive' component.
- $\textsf{\color{green}Change:}$ Issue: <a href="https://github.com/yqni13/artcreation-dv/issues/42">artdv-001</a>.
- $\textsf{\color{red}Patch:}$ Addressing github dependabot alerts: adapted dependencies.
- $\textsf{\color{green}Change:}$ Adapted info data of developer in 'imprint' component.

### 2024/10/03 - $\textsf{update\ 1.0.0-beta.6\ >>\ {\color{pink}1.0.0-beta.7}}$

- $\textsf{\color{teal}Addition:}$ New content (features) added to 'gallery' component.
- $\textsf{\color{green}Change:}$ Added listener to en/disable contact form submit button to avoid unintended sending of same message multiple times.
- $\textsf{\color{green}Change:}$ Refactored de/en.json to work with placeholder variables for dynamic translations and added missing validation-message translations.
- $\textsf{\color{green}Change:}$ Renamed project and specific pre-selector to fit domain name later on.

### 2024/09/29 - $\textsf{update\ 1.0.0-beta.5\ >>\ {\color{pink}1.0.0-beta.6}}$

- $\textsf{\color{green}Change:}$ Adapted some translations.
- $\textsf{\color{green}Change:}$ Added dynamic setting of 'lang' attribute in index.html to avoid unwanted google translation.
- $\textsf{\color{teal}Addition:}$ New content (features) added to 'gallery' component.
- $\textsf{\color{red}Bugfix:}$ Ordering an artwork, available as original or print can be selected separetely in contact form. [Before: Ordering artwork available as orginal or print would fail the dropdown selection of 'type'.]

### 2024/09/28 - $\textsf{update\ 1.0.0-beta.4\ >>\ {\color{pink}1.0.0-beta.5}}$

- $\textsf{\color{green}Change:}$ Added navigation subscription to always get current and previous route from navigation service.
- $\textsf{\color{green}Change:}$ Added keylisteners to control carousel in 'home' component and scrolling/return inside the gallery.
- $\textsf{\color{green}Change:}$ In mobile version, gallery preview images are now always 3 images each row, adapting in size to fit row.
- $\textsf{\color{teal}Addition:}$ New content (features) added to 'gallery' component.
- $\textsf{\color{red}Bugfix:}$ All data get removed from contact form after navigating to other components. [Before: Reference number, used by 'request price' in 'gallery-details' component, stayed in contact form even after navigating to other components.]

### 2024/09/25 - $\textsf{update\ 1.0.0-beta.3\ >>\ {\color{pink}1.0.0-beta.4}}$

- $\textsf{\color{green}Change:}$ Added internationalization (i18n) to translate to english or german language.
- $\textsf{\color{green}Change:}$ Improved localstorage handling.
- $\textsf{\color{teal}Addition:}$ New content (features) added to README.

### 2024/09/16 - $\textsf{update\ 1.0.0-beta.2\ >>\ {\color{pink}1.0.0-beta.3}}$

- $\textsf{\color{green}Change:}$ Added customized preload/lazy loading to gallery.
- $\textsf{\color{green}Change:}$ Resized images to improve loading efficiency.
- $\textsf{\color{teal}Addition:}$ New content (features) added to README.

### 2024/09/10 - $\textsf{update\ 1.0.0-beta.1\ >>\ {\color{pink}1.0.0-beta.2}}$

- $\textsf{\color{green}Change:}$ Scrollbar set to include only scrollable content (excluding navbar in mobile mode).
- $\textsf{\color{green}Change:}$ Added scroll-to-top button on right bottom corner.
- $\textsf{\color{red}Bugfix:}$ Wrapped nav elements keep center alignment. [Before: Navigation elements that are wrapped didn't have center alignment and were displayed aligned to the left side.]

### 2024/09/09 - $\textsf{update\ 1.0.0-beta.alpha\ >>\ {\color{pink}1.0.0-beta.1}}$

- $\textsf{\color{green}Change:}$ Resized images to display smaller versions on previews / smaller displays (gallery detail / archive) and increase loading speed.
- $\textsf{\color{green}Change:}$ Return-to-gallery button in gallery details fixed in position to stay while scrolling.
- $\textsf{\color{red}Bugfix:}$ Responsive design of gallery details supports device resolutions for width (400px > x < 1800px) and height (400px > y < 1400px). [Before: Gallery details didn't support resolutions under 700px of height and scaled wrong.]
- $\textsf{\color{red}Bugfix:}$ Navigating to other page in menu resets scroll point to top position while maintaining scrollbar where its supposed to be visible (refresh gets back to current scroll position). [Before: Scroll position was reused for next page so that it didn't start at top and scrollbar worked or the other way around (both did not work simultaneously).]

### 2024/09/07 - $\textsf{update\ 1.0.0-alpha.8\ >>\ {\color{pink}1.0.0-beta.alpha}}$

- $\textsf{\color{teal}Addition:}$ New content added to gallery.
- $\textsf{\color{teal}Addition:}$ Basic structure of README.md added.
- $\textsf{\color{green}Change:}$ Run deployment via https//app.netlify.com host.
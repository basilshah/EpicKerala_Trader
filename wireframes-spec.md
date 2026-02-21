# Low-Fidelity Wireframe Specifications

## 1) Homepage Template

### Mobile
- Section order: `Navbar` -> `HeroSection` -> `FeaturedCategoriesSection` -> `FeaturedProductsSection` -> `FeaturedExportersSection` -> `CTASection` -> `Footer`.
- Hero: stacked headline, description, search form (input + full-width button), two CTAs, popular tags.
- Cards: single-column grids, consistent vertical rhythm and spacing.

### Desktop
- Hero: two-column split (copy/search/CTA on left, illustration on right).
- Featured sections: 4-column categories/products, 3-column exporters.
- CTA: centered headline + two side-by-side buttons.

### Atomic mapping
- Atoms: `Button`, `Input`, `Badge`, `ErrorMessage`, `SuccessMessage`.
- Molecules: `SectionHeader`.
- Organisms: `HeroSection`, `FeaturedCategoriesSection`, `FeaturedProductsSection`, `FeaturedExportersSection`, `CTASection`.
- Template: `HomePage`.

### Breakpoint behavior
- `mobile (<=640)`: single-column cards, search controls stacked.
- `tablet (641-1023)`: 2-column grids where possible.
- `desktop (>=1024)`: full multi-column layout and larger typographic scale.

## 2) Category Listing Template (`/categories`)

### Mobile
- Section order: `PageHeader` -> `CategoryGrid`.
- Grid collapses to one card per row.

### Desktop
- Header centered with summary text.
- Grid expands to 2 then 3 columns.

### Atomic mapping
- Molecules: `SectionHeader`.
- Organisms: `CategoryCardGrid`.
- Template: `CategoriesPage`.

### Breakpoint behavior
- `mobile`: `grid-cols-1`.
- `tablet`: `md:grid-cols-2`.
- `desktop`: `lg:grid-cols-3`.

## 3) Category Detail Template (`/category/[slug]`)

### Mobile
- Section order: `CategoryHeroCard` (stacked text then image) -> `SubcategoryFilters` -> `SiblingFilters` -> `ProductGrid`.
- Stats stay in 2 compact metrics row.

### Desktop
- Hero card in two columns (text + image).
- Filters remain horizontal wrap.

### Atomic mapping
- Molecules: `SectionHeader`, filter chips.
- Organisms: `CategoryHeader`, `CategoryFilterBar`, `ProductGrid`.
- Template: `CategoryPage`.

### Breakpoint behavior
- `mobile`: image height ~220.
- `tablet`: image ~260.
- `desktop`: image ~300 and 2-column hero.

## 4) Product Detail Template (`/product/[slug]`)

### Mobile
- Section order: `ImageCarousel` -> `ProductMeta` -> `Specs` -> `CatalogDownloads` -> `RFQForm` -> `SellerCard`.
- Carousel controls always visible and touch friendly.

### Desktop
- Main content and sidebar split (2:1).
- Seller/RFQ persist as right-side context.

### Atomic mapping
- Atoms: `Button`, `Badge`.
- Molecules: spec row, file row.
- Organisms: `ProductImageCarousel`, `ProductDetailPanel`, `RFQForm`, `SellerSummaryCard`.
- Template: `ProductPage`.

### Breakpoint behavior
- `mobile`: single column.
- `tablet+`: `md:grid-cols-3` with `md:col-span-2` for main content.

## 5) Dashboard Navigation Shell

### Mobile
- Sticky top bar with logo + menu icon (44x44 minimum tap target).
- Expandable stacked nav links and auth action.

### Desktop
- Horizontal nav with active state indicator.
- Sign-out button right aligned.

### Atomic mapping
- Atoms: `Button`, icon buttons.
- Molecules: `NavLinkItem`.
- Organisms: `DashboardNav`, `Navbar`.
- Template: Dashboard pages.

### Breakpoint behavior
- `mobile`: menu panel toggle.
- `desktop`: inline nav/actions with hidden mobile panel.

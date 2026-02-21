# Refactor Audit and Migration Map

## Priority 1 (Immediate)

- `app/page.tsx`
  - Monolithic hero/sections and inline featured seller card markup.
  - Inconsistent section spacing and fixed hero heights impacting mobile.
  - Action: extract section organisms and standardize spacing + responsive rules.
- `components/dashboard/AddProductForm.tsx`
  - Repeated form-level error and field-level error patterns.
  - File upload logic duplicated with other forms.
  - Action: adopt shared `ErrorMessage`, `FieldError`, and reusable form field wrappers.
- `components/dashboard/EditProductForm.tsx`
  - Mirrors AddProductForm duplication (alerts/field errors/uploads).
  - Action: reuse same shared form molecules and reduce drift.
- `components/dashboard/ProfileForm.tsx`
  - Duplicated error and upload/picker patterns.
  - Action: align to shared form components for consistency.

## Priority 2 (High)

- `app/category/[slug]/page.tsx`
  - Fixed media height and large heading without mobile scaling.
  - Action: responsive height and typography normalization.
- `app/product/[slug]/page.tsx`
  - 2-column/3-column transitions and carousel controls need better mobile ergonomics.
  - Action: improve grid breakpoints and touch targets.
- `components/layout/Navbar.tsx`
  - Mobile toggle target and menu ergonomics can be improved.
  - Action: increase tap targets and stabilize mobile menu UX.
- `components/layout/Footer.tsx`
  - Social icon and legal links wrapping can be improved on narrow widths.
  - Action: use responsive gaps/wrapping and touch-friendly targets.

## Priority 3 (Medium)

- `components/cards/ProductCard.tsx`
  - Fixed image height not ideal on very small devices.
  - Action: responsive image area and consistent badge spacing.
- `components/cards/CategoryCard.tsx`
  - Fixed image height and text density on small screens.
  - Action: responsive card image height and spacing.
- `components/product/ProductImageCarousel.tsx`
  - Navigation controls below recommended touch target size.
  - Action: enforce >=44px touch targets on mobile.

## Migration Order

1. Introduce atomic primitives (`ErrorMessage`, `FieldError`, `SuccessMessage`, `SectionHeader`, `FormField`).
2. Refactor homepage into section organisms and extract `SellerCard` use.
3. Move forms to shared field/error molecules.
4. Run global mobile compatibility pass on pages + nav/footer/carousel/buttons.
5. Publish wireframe spec with component mapping for all key templates.
6. Validate with lint and responsive QA checklist.

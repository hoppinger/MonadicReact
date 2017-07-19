## doing
- documentation
- cleanup dependencies in imports (samples and monad definition)

## GO (7 days)
- [ ] headless renderer setup in scaffolder
- [ ] info pages
  - [ ] welcome
  - [ ] manifesto
  - [ ] contact
- [ ] login/logout
- [ ] access to admin pages
- [ ] course selection
- [ ] lecture selection
- [ ] exam selection
- [ ] dashboard


## various improvements
- [ ] cleanup dependencies in imports (samples and monad definition)

## samples (3 days)
- [ ] all primitives, one per sample (use menu nesting)
- [ ] all
- [ ] workflow/form with selection from list of other entities
- [ ] form with list of related entities
- [ ] form with
  - [1/3] date, time, date-time
  - [ ] custom field in form
  - [ ] rich-text
  - [ ] tel, url, email
  - [ ] file
  - [x] lazy-file
- [x] list and paginator samples in own files
- [x] edit list
- [ ] paginated list of entities
- [x] files

## external (3 days)
- [x] i18n
- [ ] documentation
  - [ ] verify all snippets
  - [ ] screenshots
- [x] publish online for designers
- [x] remove dotnet core from sample
  - [ ] restore samples requiring an API: file, forms, workflow
    - [ ] fake api with dictionary
- [ ] linkedin post
- [ ] reddit post

## styling
- [x] menu
- [x] tabs
- [/] form errors
- [x] disabled plus/minus toggle
- [ ] plus/minus has disappeared
- [ ] radio buttons
- [ ] edit lists and monadic-list-item
- [ ] links
- [ ] overlays
- [ ] pagination
- [ ] rich text (all text styles and images)
- [ ] toggle without label (for example within an edit list)
- [ ] tabs "pagination"
- [ ] busy/error in lift promise
- [ ] hierarchical menu

##  scaffolder (4 days)
- [ ] Api.getMWithPictures/updateMWithPictures operators should already be lifted out of the box (from the scaffolder)
- [ ] Api.getM/updateM/download_pic/upload_pic operators should already be lifted out of the box (from the scaffolder)
- [ ] default scaffolder views should use the monadic library

## fridge
- [ ] fold
- [ ] mapM
- [ ] mapL
- [ ] className by default in all CmdCommon
- [ ] add math plugin https://github.com/efloti/draft-js-mathjax-plugin
- [ ] also parse url query
- [ ] repeat-from, a wrapper on repeat which takes as first input the initial value A
- [ ] use never instead of filter(_ => false)
# Tag Persistence

Tags are currently smuggled inside the `question` column as a `[tag] title` prefix.
The goal is to persist tags as a dedicated attribute across the full stack.

## Current State (after spec cleanup)

- Specs consolidated into one scenario in `Question.Create.Tag.feature` + tag added to `Question.Edit.Form.feature` prepopulated fields scenario
- `Question.Take.SeeTag.feature` still exists — tests the legacy `[tag]` prefix stripping. Delete once tag has its own column.
- Frontend has a dedicated tag input field, but `buildQuestionTitle()` in `question-form-state.ts` combines it into `[tag] title` before sending to the API
- Frontend reads back the combined string and parses it with `parseTag()` (`model/tag.ts`) and `stripTag()` (`question-display.ts`)
- Backend treats the `question` string as opaque — no tag awareness

## Changes Needed

### Database
- Flyway migration: add `tag` column (nullable varchar) to `question` table

### Backend
- `Question.java` — add `tag` field
- `QuestionRequest.java` — add `tag` field
- `QuestionResponse.java` — add `tag` field
- `QuestionListItem.java` (workspace DTO) — add `tag` field

### Frontend
- `question-form-state.ts` — send `tag` as separate field, stop building `[tag] title`
- `model/question.ts` — add `tag` to `Question` type
- `model/question-list-item.ts` — add `tag` to `QuestionListItem`
- `question-item.tsx` (workspace) — read `tag` from field instead of `parseTag()`
- `question-select.tsx` (quiz creation) — same
- `question-header.tsx` — stop calling `stripTag()`, title is already clean
- `model/tag.ts` — `parseTag()` becomes unused, keep `tagToColor()` only
- `question-display.ts` — `stripTag()` becomes unused, remove

### Specs
- Delete `specs/features/take/question/Question.Take.SeeTag.feature`
- `ops.ts` `enterTag` — stop prepending `[tag]` to `questionWip.question`, once tag is a separate field

### Data Migration
- Consider migrating existing `[tag] title` data: extract tag into new column, clean title
- Or leave existing data as-is if no production data exists

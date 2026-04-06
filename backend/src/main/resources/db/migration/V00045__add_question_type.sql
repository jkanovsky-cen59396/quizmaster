-- Add question_type column with default (backfills all existing rows as 'single')
ALTER TABLE question ADD COLUMN question_type VARCHAR(10) DEFAULT 'single' NOT NULL;

-- Backfill: detect existing numerical questions
UPDATE question SET question_type = 'numerical'
WHERE tolerance IS NOT NULL
   OR (array_length(answers, 1) = 1
       AND array_length(correct_answers, 1) = 1
       AND correct_answers[1] = 0);

-- Backfill: detect existing multiple-choice questions
UPDATE question SET question_type = 'multiple'
WHERE question_type = 'single'
  AND array_length(correct_answers, 1) >= 2;

-- Enum constraint
ALTER TABLE question ADD CONSTRAINT chk_question_type
    CHECK (question_type IN ('single', 'multiple', 'numerical'));

-- Per-type structural constraints
ALTER TABLE question ADD CONSTRAINT chk_single_answers
    CHECK (question_type != 'single' OR (
        array_length(answers, 1) >= 2 AND array_length(correct_answers, 1) = 1));

ALTER TABLE question ADD CONSTRAINT chk_multiple_answers
    CHECK (question_type != 'multiple' OR (
        array_length(answers, 1) >= 2 AND array_length(correct_answers, 1) >= 2));

ALTER TABLE question ADD CONSTRAINT chk_numerical_answers
    CHECK (question_type != 'numerical' OR (
        array_length(answers, 1) = 1 AND array_length(correct_answers, 1) = 1));

-- Type-specific attribute constraints
ALTER TABLE question ADD CONSTRAINT chk_tolerance_only_numerical
    CHECK (question_type = 'numerical' OR tolerance IS NULL);

ALTER TABLE question ADD CONSTRAINT chk_tolerance_non_negative
    CHECK (tolerance IS NULL OR tolerance >= 0);

ALTER TABLE question ADD CONSTRAINT chk_is_easy_only_multiple
    CHECK (question_type = 'multiple' OR is_easy = FALSE);

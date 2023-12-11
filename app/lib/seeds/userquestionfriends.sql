-- SEEDS
-- UserQuestionFriends

INSERT INTO UserQuestionFriends ( -- LePapier, Favorite actress
-- shared to Alice-chan
-- !! Former 'Favorite series' !! --
    userquestionfriend_id,
    userquestion_id,
    contact_id,
    userquestionfriend_state,
    userquestionfriend_created_at,
    userquestionfriend_updated_at
)
VALUES (
    'f8e7226b-1b54-4518-8dbd-ba0f5cd60f70',
    '7088c90a-81e8-43e3-9f42-5967668be80d',
    '47b3155e-8af4-471a-919e-d4d470667b65',
    'LIVE',
    now(),
    now()
); -- Done. 

INSERT INTO UserQuestionFriends ( -- Alice-chan, Favorite actor
-- shared to LePapier
    userquestionfriend_id,
    userquestion_id,
    contact_id,
    userquestionfriend_state,
    userquestionfriend_created_at,
    userquestionfriend_updated_at
)
VALUES (
    'ccd1c4e2-5d94-4054-81d1-1860e21ab6a0',
    '3893e004-959d-4cfe-b099-84d4ee1ca104',
    'd82d3469-a60c-4696-9c02-b7b93ce32c7c',
    'LIVE',
    now(),
    now()
); -- Done. 

INSERT INTO UserQuestionFriends ( -- LePapier, Favorite anime waifu
-- shared to Alice-chan
    userquestionfriend_id,
    userquestion_id,
    contact_id,
    userquestionfriend_state,
    userquestionfriend_created_at,
    userquestionfriend_updated_at
)
VALUES (
    '5d8715e7-9425-4380-94dc-c27b87a283e3',
    '6435cb5e-68f9-4e9d-bcb5-aa7d1cce1771',
    '47b3155e-8af4-471a-919e-d4d470667b65',
    'LIVE',
    now(),
    now()
); -- Done. 

INSERT INTO UserQuestionFriends ( -- LePapier, Favorite anime waifu
-- no longer shared to Trovounette
    userquestionfriend_id,
    userquestion_id,
    contact_id,
    userquestionfriend_state,
    userquestionfriend_created_at,
    userquestionfriend_updated_at
)
VALUES (
    '2d16450d-15b0-432b-838f-4fc5e6180c22',
    '6435cb5e-68f9-4e9d-bcb5-aa7d1cce1771',
    'b8d1d6bd-89b1-4759-aef9-71d6cf09b69f',
    'DELETED',
    now(),
    now()
); -- Done. 

-- PLUS

INSERT INTO UserQuestionFriends ( -- LePapier, Favorite anime waifu
-- shared to MisterX
    userquestionfriend_id,
    userquestion_id,
    contact_id,
    userquestionfriend_state,
    userquestionfriend_created_at,
    userquestionfriend_updated_at
)
VALUES (
    '5b173d8d-a214-41b4-967c-c1f781c56253',
    '6435cb5e-68f9-4e9d-bcb5-aa7d1cce1771',
    'a482ca35-d86f-4d0e-8da8-d557f3d8ec93',
    'LIVE',
    now(),
    now()
);


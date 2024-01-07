-- SEEDS
-- Contacts

-- “me” and Alice / relation combination “irl” --

INSERT INTO Contacts ( -- “me” and Alice
    contact_id,
    user_first_id,
    user_last_id,
    contact_state,
    contact_kind,
    contact_created_at,
    contact_updated_at
)
VALUES ( -- from “me” to Alice
    '47b3155e-8af4-471a-919e-d4d470667b65',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    'LIVE',
    'IRL',
    now(),
    now()
), ( -- from Alice to “me”
    'd82d3469-a60c-4696-9c02-b7b93ce32c7c',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'LIVE',
    'IRL',
    now(),
    now()
); -- Done. 

UPDATE Contacts -- mirror contact from Alice to “me”
SET 
    contact_mirror_id = 'd82d3469-a60c-4696-9c02-b7b93ce32c7c',
    contact_updated_at = now()
WHERE contact_id = '47b3155e-8af4-471a-919e-d4d470667b65'; -- Done. 

UPDATE Contacts -- mirror contact from “me” to Alice
SET 
    contact_mirror_id = '47b3155e-8af4-471a-919e-d4d470667b65',
    contact_updated_at = now()
WHERE contact_id = 'd82d3469-a60c-4696-9c02-b7b93ce32c7c'; -- Done.

-- “me” and Bianca / relation combination “friend” --

INSERT INTO Contacts ( -- “me” and Bianca
    contact_id,
    user_first_id,
    user_last_id,
    contact_state,
    contact_kind,
    contact_created_at,
    contact_updated_at
)
VALUES ( -- from “me” to Bianca
    'b8d1d6bd-89b1-4759-aef9-71d6cf09b69f',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '8735769e-4a14-46ff-8a10-35b40c262c8c',
    'LIVE',
    'FRIEND',
    now(),
    now()
), ( -- from Bianca to “me”
    '25e9b4aa-4ccc-4d8d-8921-531bd04aa8db',
    '8735769e-4a14-46ff-8a10-35b40c262c8c',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'LIVE',
    'FRIEND',
    now(),
    now()
); -- Done. 

UPDATE Contacts -- mirror contact from Bianca to “me”
SET 
    contact_mirror_id = '25e9b4aa-4ccc-4d8d-8921-531bd04aa8db',
    contact_updated_at = now()
WHERE contact_id = 'b8d1d6bd-89b1-4759-aef9-71d6cf09b69f'; -- Done.

UPDATE Contacts -- mirror contact from “me” to Bianca
SET 
    contact_mirror_id = 'b8d1d6bd-89b1-4759-aef9-71d6cf09b69f',
    contact_updated_at = now()
WHERE contact_id = '25e9b4aa-4ccc-4d8d-8921-531bd04aa8db'; -- Done.

-- “me” and Candice / relation combination “none” --

INSERT INTO Contacts ( -- “me” and Candice
    contact_id,
    user_first_id,
    user_last_id,
    contact_state,
    contact_kind,
    contact_created_at,
    contact_updated_at
)
VALUES ( -- from “me” to Candice
    'fa42999f-12f7-47ed-b1ca-d3406f5a1c53',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'f58880aa-ea97-4643-a787-29fe70507639',
    'LIVE',
    'NONE',
    now(),
    now()
), ( -- from Candice to “me”
    '0c6ab84c-7937-497b-b10f-d3b9e36936e9',
    'f58880aa-ea97-4643-a787-29fe70507639',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'LIVE',
    'NONE',
    now(),
    now()
); -- Done. 

UPDATE Contacts -- mirror contact from Candice to “me”
SET 
    contact_mirror_id = '0c6ab84c-7937-497b-b10f-d3b9e36936e9',
    contact_updated_at = now()
WHERE contact_id = 'fa42999f-12f7-47ed-b1ca-d3406f5a1c53'; -- Done. 

UPDATE Contacts -- mirror contact from “me” to Candice
SET 
    contact_mirror_id = 'fa42999f-12f7-47ed-b1ca-d3406f5a1c53',
    contact_updated_at = now()
WHERE contact_id = '0c6ab84c-7937-497b-b10f-d3b9e36936e9'; -- Done. 

-- “me” and Danny / relation combination nonexistent --

-- “me” and Lucas / relation combination “friend” --

INSERT INTO Contacts ( -- “me” and Lucas
    contact_id,
    user_first_id,
    user_last_id,
    contact_state,
    contact_kind,
    contact_created_at,
    contact_updated_at
)
VALUES ( -- from “me” to Lucas
    '6bb14ae7-6518-4f8b-a631-4ed1784fee37',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'c023df48-15a8-4d81-a19a-655a6f766655',
    'LIVE',
    'FRIEND',
    now(),
    now()
), ( -- from Lucas to “me”
    '05e5c7d9-c6c5-4a41-890d-177963339ea3',
    'c023df48-15a8-4d81-a19a-655a6f766655',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'LIVE',
    'FRIEND',
    now(),
    now()
); -- Done. 

UPDATE Contacts -- mirror contact from Lucas to “me”
SET 
    contact_mirror_id = '05e5c7d9-c6c5-4a41-890d-177963339ea3',
    contact_updated_at = now()
WHERE contact_id = '6bb14ae7-6518-4f8b-a631-4ed1784fee37'; -- Done. 

UPDATE Contacts -- mirror contact from “me” to Lucas
SET 
    contact_mirror_id = '6bb14ae7-6518-4f8b-a631-4ed1784fee37',
    contact_updated_at = now()
WHERE contact_id = '05e5c7d9-c6c5-4a41-890d-177963339ea3'; -- Done. 

-- “me” and Malcolm / relation combination “irl” --

INSERT INTO Contacts ( -- “me” and Malcolm
    contact_id,
    user_first_id,
    user_last_id,
    contact_state,
    contact_kind,
    contact_created_at,
    contact_updated_at
)
VALUES ( -- from “me” to Malcolm
    'a482ca35-d86f-4d0e-8da8-d557f3d8ec93',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '78e09b4e-1f99-44a5-9a06-dbb650a881d6',
    'LIVE',
    'IRL',
    now(),
    now()
), ( -- from Malcolm to “me”
    '16e15409-7067-4076-8fac-3511ce066fe0',
    '78e09b4e-1f99-44a5-9a06-dbb650a881d6',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'LIVE',
    'IRL',
    now(),
    now()
); -- Done. 

UPDATE Contacts -- mirror contact from Malcolm to “me”
SET 
    contact_mirror_id = '16e15409-7067-4076-8fac-3511ce066fe0',
    contact_updated_at = now()
WHERE contact_id = 'a482ca35-d86f-4d0e-8da8-d557f3d8ec93'; -- Done. 

UPDATE Contacts -- mirror contact from “me” to Malcolm
SET 
    contact_mirror_id = 'a482ca35-d86f-4d0e-8da8-d557f3d8ec93',
    contact_updated_at = now()
WHERE contact_id = '16e15409-7067-4076-8fac-3511ce066fe0'; -- Done. 

-- “me” and Nancy / relation combination “blocking” --

INSERT INTO Contacts ( -- “me” and Nancy
    contact_id,
    user_first_id,
    user_last_id,
    contact_state,
    contact_blocking,
    contact_created_at,
    contact_updated_at
)
VALUES ( -- from “me” to Nancy
    '1e52e857-d2b3-4b06-b3a9-a2d127e962ba',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '95d04544-62c5-4da2-bdc6-38c674e49295',
    'LIVE',
    TRUE,
    now(),
    now()
), ( -- from Nancy to “me”
    '283d9040-54ef-45c7-b7c1-217e768e7536',
    '95d04544-62c5-4da2-bdc6-38c674e49295',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'LIVE',
    FALSE,
    now(),
    now()
); -- Done. 

UPDATE Contacts -- mirror contact from Nancy to “me”
SET 
    contact_mirror_id = '283d9040-54ef-45c7-b7c1-217e768e7536',
    contact_updated_at = now()
WHERE contact_id = '1e52e857-d2b3-4b06-b3a9-a2d127e962ba'; -- Done. 

UPDATE Contacts -- mirror contact from “me” to Nancy
SET 
    contact_mirror_id = '1e52e857-d2b3-4b06-b3a9-a2d127e962ba',
    contact_updated_at = now()
WHERE contact_id = '283d9040-54ef-45c7-b7c1-217e768e7536'; -- Done. 

-- “me” and Ophelia / relation combination “blocked” --

INSERT INTO Contacts ( -- “me” and Ophelia
    contact_id,
    user_first_id,
    user_last_id,
    contact_state,
    contact_blocking,
    contact_created_at,
    contact_updated_at
)
VALUES ( -- from “me” to Ophelia
    '293be617-e711-4f2a-ae35-af959d012289',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '57672a3e-ee2b-4e88-be43-6d5c71bffc3d',
    'LIVE',
    FALSE,
    now(),
    now()
), ( -- from Ophelia to “me”
    '99b1fb21-c053-4a53-b1ab-87ac7fdb5d2d',
    '57672a3e-ee2b-4e88-be43-6d5c71bffc3d',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'LIVE',
    TRUE,
    now(),
    now()
); -- Done. 

UPDATE Contacts -- mirror contact from Ophelia to “me”
SET 
    contact_mirror_id = '99b1fb21-c053-4a53-b1ab-87ac7fdb5d2d',
    contact_updated_at = now()
WHERE contact_id = '293be617-e711-4f2a-ae35-af959d012289'; -- Done. 

UPDATE Contacts -- mirror contact from “me” to Ophelia
SET 
    contact_mirror_id = '293be617-e711-4f2a-ae35-af959d012289',
    contact_updated_at = now()
WHERE contact_id = '99b1fb21-c053-4a53-b1ab-87ac7fdb5d2d'; -- Done. 

-- “me” and Pamela / relation combination “blocking-and-blocked” --

INSERT INTO Contacts ( -- “me” and Pamela
    contact_id,
    user_first_id,
    user_last_id,
    contact_state,
    contact_blocking,
    contact_created_at,
    contact_updated_at
)
VALUES ( -- from “me” to Pamela
    '2dcdaa5d-1de0-4d7b-99d4-5e36ce9d25c7',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '7e30c890-b74f-4c70-9d1d-022e94b4f983',
    'LIVE',
    TRUE,
    now(),
    now()
), ( -- from Pamela to “me”
    '3b6e4401-9068-4da9-9c01-55478b701bc4',
    '7e30c890-b74f-4c70-9d1d-022e94b4f983',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'LIVE',
    TRUE,
    now(),
    now()
); -- Done. 

UPDATE Contacts -- mirror contact from Pamela to “me”
SET 
    contact_mirror_id = '3b6e4401-9068-4da9-9c01-55478b701bc4',
    contact_updated_at = now()
WHERE contact_id = '2dcdaa5d-1de0-4d7b-99d4-5e36ce9d25c7'; -- Done. 

UPDATE Contacts -- mirror contact from “me” to Pamela
SET 
    contact_mirror_id = '2dcdaa5d-1de0-4d7b-99d4-5e36ce9d25c7',
    contact_updated_at = now()
WHERE contact_id = '3b6e4401-9068-4da9-9c01-55478b701bc4'; -- Done. 


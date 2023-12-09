-- SEEDS
-- UserQuestions

INSERT INTO UserQuestions ( -- LePapier, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '045105d2-76bb-4b06-9329-ec9d70a0497c',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Last name
-- native / irl / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '6f6a9d78-8412-430d-b406-6ec0ed8e5cd2',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Alice-chan, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'a68c4637-35ba-4251-bca9-de3c0ca44021',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Alice-chan, Last name
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '5e882712-f12d-4017-a126-05c23a9ea325',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Favorite actress
-- custom / shared (1)
-- !! Former 'Favorite series' !! --
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '7088c90a-81e8-43e3-9f42-5967668be80d',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '1dbf7b3b-2a0a-4a9b-bba8-40aa74fcf874',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Alice-chan, Favorite actor
-- custom / shared (1)
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '3893e004-959d-4cfe-b099-84d4ee1ca104',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    'ffb298c5-e038-44f9-8704-21182691b34e',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Favorite actor
-- custom / not shared
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '5aa42a8c-4b73-4cce-ba48-ed9548c19ef1',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'ffb298c5-e038-44f9-8704-21182691b34e',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Alice-chan, Favorite actress
-- custom / not shared
-- !! Former 'Favorite series' !! --
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'f1547f90-7da8-4e93-9de3-eec575990405',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    '1dbf7b3b-2a0a-4a9b-bba8-40aa74fcf874',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Trovounette, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '72974ca5-802d-4de7-98af-24f33a99a294',
    '8735769e-4a14-46ff-8a10-35b40c262c8c',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Trovounette, Last name
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'fcd75c16-0ff1-4a93-b174-d26f78d50f36',
    '8735769e-4a14-46ff-8a10-35b40c262c8c',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Candi, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '9c430e58-edf9-46ac-b4a3-b951e0ebab8f',
    'f58880aa-ea97-4643-a787-29fe70507639',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Candi, Last name
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'af85cb23-3c7d-4b05-a860-6ca369e748c0',
    'f58880aa-ea97-4643-a787-29fe70507639',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- D-Dan, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '214879d7-ea80-43ce-948e-0c216a45375e',
    'd3c9e450-799a-42d9-a011-6d10b52fc4bd',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- D-Dan, Last name
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '0baca248-585c-4b21-86ee-f9cc5b5c5815',
    'd3c9e450-799a-42d9-a011-6d10b52fc4bd',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Lucario, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '233954d7-2bd8-4b8f-8eb4-ab24599f98d6',
    'c023df48-15a8-4d81-a19a-655a6f766655',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Lucario, Last name
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'df9d751b-5c8a-4002-8b29-342775caa468',
    'c023df48-15a8-4d81-a19a-655a6f766655',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Malcolm, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'b9e20aef-6668-4ee5-9683-2244b637757e',
    '78e09b4e-1f99-44a5-9a06-dbb650a881d6',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Malcolm, Last name
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '03031790-0237-446b-9a75-ce91a5394ec1',
    '78e09b4e-1f99-44a5-9a06-dbb650a881d6',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Nonyes, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'b4604114-7097-4f74-a4f2-6e3e50460536',
    '95d04544-62c5-4da2-bdc6-38c674e49295',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Nonyes, Last name
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'dd137ee0-6b78-443a-8542-91399338d94e',
    '95d04544-62c5-4da2-bdc6-38c674e49295',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Ophelia, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '89dc4d7e-6c1c-4db3-81c8-785b1cbe2726',
    '57672a3e-ee2b-4e88-be43-6d5c71bffc3d',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Ophelia, Last name
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'eef2a933-5611-4606-9d5c-7b045fc88dbf',
    '57672a3e-ee2b-4e88-be43-6d5c71bffc3d',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Pimpampoum, First name
-- native / pinned
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_is_pinned,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'f3cc74d6-5fb4-4b5a-b608-232a8ffeb9b0',
    '7e30c890-b74f-4c70-9d1d-022e94b4f983',
    'e118c30f-3a4a-4cb3-bf9a-67d04dc177a4',
    'LIVE',
    TRUE,
    now(),
    now()
);

INSERT INTO UserQuestions ( -- Pimpampoum, Last name
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '3190dc4a-eec8-4792-a9dd-81c4a97c8567',
    '7e30c890-b74f-4c70-9d1d-022e94b4f983',
    '2a389094-1259-4a3d-8126-8635aeab39fc',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Email address
-- native
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '4f46465a-b43b-49c3-9e8c-5871c3b3accd',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'b80f6893-f013-4964-b770-6935ef8fc4a4',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Other email address
-- native
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '7ff43513-de87-49bd-9186-46d840fbff1c',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'ba3a314a-98a4-419d-a0c7-6d9eab5ac2cf',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Address
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '9e14dd28-fea0-45ed-8b14-b0e44cf9333d',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '6e451910-5f31-4649-9451-ad135663e71d',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Other address
-- native / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '94350b03-3368-45a3-9431-ae480e21970b',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '05e01dae-1884-478c-aa19-2231355948ee',
    'LIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Birthday
-- pseudonative
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_kind,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '308602f3-1ecc-4089-a9f8-5beda1ff6b7d',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '34ce07f9-03c3-41b9-b36d-26bbebcf4998',
    'LIVE',
    'PSEUDONATIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Mother's birthday
-- pseudonative
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_kind,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '302aab4f-412c-4588-a804-fefd7af92f47',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '1eb27595-094d-421e-a508-14b53cf99c42',
    'LIVE',
    'PSEUDONATIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Girlfriend's birthday
-- pseudonative / irl 
-- for preexisting pseudonative irl (answer live) 
-- when creating same pseudonative not irl criteria
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_kind,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'f67ae4be-6c09-4d05-a0f4-a859c06756a5',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'ec7370c8-18ad-4df3-85da-96d141c1a67e',
    'LIVE',
    'PSEUDONATIVEIRL',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Crush's birthday
-- pseudonative / irl 
-- for preexisting pseudonative irl (answer deleted) 
-- when creating same pseudonative not irl criteria
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_kind,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'beed9e53-0ff9-445c-8bfe-dd39ed0ae20a',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '40b2ecf3-397c-4be0-81f4-99363a4d1a53',
    'LIVE',
    'PSEUDONATIVEIRL',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Birthdate
-- pseudonative / irl
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_kind,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'd25f5552-9a9f-440b-860c-1591f59eec4f',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '4b7bcb0d-2eb1-4783-a762-7fbfb7106f6d',
    'LIVE',
    'PSEUDONATIVEIRL',
    now(),
    now()
);

INSERT INTO Questions ( -- LePapier, Mother's birthdate
-- pseudonative / irl
    question_id,
    question_name,
    question_state,
    question_kind,
    question_created_at,
    question_updated_at
)
VALUES (
    '4caf41b5-61af-4f69-be69-f6e74c899ed9',
    'Mother’s birthdate',
    'LIVE',
    'PSEUDO',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Girlfriend's birthdate
-- pseudonative
-- for preexisting pseudonative not irl (answer live) 
-- when creating same pseudonative irl criteria
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_kind,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    '6d9d2ced-00ac-466a-bcd6-ee01bd390b03',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '73fe5a9d-3bc2-477d-abe4-bda3efaf7573',
    'LIVE',
    'PSEUDONATIVE',
    now(),
    now()
);

INSERT INTO UserQuestions ( -- LePapier, Crush's birthdate
-- pseudonative
-- for preexisting pseudonative not irl (answer deleted) 
-- when creating same pseudonative irl criteria
    userquestion_id,
    user_id,
    question_id,
    userquestion_state,
    userquestion_kind,
    userquestion_created_at,
    userquestion_updated_at
)
VALUES (
    'f70c608c-0112-4b27-97b6-8d82ac18550d',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '7052b6ca-28c7-4a8f-859d-c93dc6db36cc',
    'LIVE',
    'PSEUDONATIVE',
    now(),
    now()
);


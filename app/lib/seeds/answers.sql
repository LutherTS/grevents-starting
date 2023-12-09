-- SEEDS
-- Answers

INSERT INTO Answers ( -- LePapier, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'd6a6a94e-0366-41ee-bbf9-b1c8f40688d0',
    '045105d2-76bb-4b06-9329-ec9d70a0497c',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'Luther',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Last name
-- native / irl / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '008bf1cf-d307-497d-8fb0-ce102e8481fd',
    '6f6a9d78-8412-430d-b406-6ec0ed8e5cd2',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'Tchofo Safo',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Alice-chan, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'f85d1f69-a9e3-46ca-a3ba-08c8060dbdb0',
    'a68c4637-35ba-4251-bca9-de3c0ca44021',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    'Alice',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Alice-chan, Last name
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'd70b347c-9f3c-4773-894a-bdf0bf5616f9',
    '5e882712-f12d-4017-a126-05c23a9ea325',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    'Perrini',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Favorite actress
-- custom / shared (1)
-- !! Former 'Favorite series' !! --
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '7636b204-ad16-4bdb-bba3-61d405948167',
    '7088c90a-81e8-43e3-9f42-5967668be80d',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'Reese Witherspoon',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Alice-chan, Favorite actor
-- custom / shared (1)
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'dcd05421-256d-46c6-8233-bc78ec22b3aa',
    '3893e004-959d-4cfe-b099-84d4ee1ca104',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    'Denzel Washington',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Favorite actor
-- custom / not shared
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '8c274145-42c8-4b3f-8617-e0b1b8ad48c9',
    '5aa42a8c-4b73-4cce-ba48-ed9548c19ef1',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'Will Smith',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Alice-chan, Favorite actress
-- custom / not shared
-- !! Former 'Favorite series' !! --
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'b452edf0-ad29-4807-87d4-a71e4da99f8f',
    'f1547f90-7da8-4e93-9de3-eec575990405',
    'e17bc7f7-b93f-4915-9f72-83d055c66e77',
    'Megan Fox',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Trovounette, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '5b866df8-3593-4b52-bb98-457d9ca5920c',
    '72974ca5-802d-4de7-98af-24f33a99a294',
    '8735769e-4a14-46ff-8a10-35b40c262c8c',
    'Bianca',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Trovounette, Last name
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'e755b12b-e3b8-4c46-a92c-ffcb328fc353',
    'fcd75c16-0ff1-4a93-b174-d26f78d50f36',
    '8735769e-4a14-46ff-8a10-35b40c262c8c',
    'Trovò',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Candi, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '2cc2eac9-2001-49e5-a74a-96de2a32fbd0',
    '9c430e58-edf9-46ac-b4a3-b951e0ebab8f',
    'f58880aa-ea97-4643-a787-29fe70507639',
    'Candice',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Candi, Last name
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'e543b83e-34c1-4b0c-93d4-7b4a47f545c7',
    'af85cb23-3c7d-4b05-a860-6ca369e748c0',
    'f58880aa-ea97-4643-a787-29fe70507639',
    'Namubiru',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- D-Dan, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '8d816a37-759a-4172-ac84-b7a44ad60375',
    '214879d7-ea80-43ce-948e-0c216a45375e',
    'd3c9e450-799a-42d9-a011-6d10b52fc4bd',
    'Daniel',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- D-Dan, Last name
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'a59c387b-d249-4aea-bb4f-ad3746bc9e6f',
    '0baca248-585c-4b21-86ee-f9cc5b5c5815',
    'd3c9e450-799a-42d9-a011-6d10b52fc4bd',
    'Craig',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Lucario, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '9cc6114b-8825-469d-a814-40515e5422bc',
    '233954d7-2bd8-4b8f-8eb4-ab24599f98d6',
    'c023df48-15a8-4d81-a19a-655a6f766655',
    'Lucas',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Lucario, Last name
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'dd229a19-3cd5-484f-bd74-17d2ae62aa49',
    'df9d751b-5c8a-4002-8b29-342775caa468',
    'd3c9e450-799a-42d9-a011-6d10b52fc4bd',
    'Earthbound',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- MisterX, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '62772fc1-141b-48ea-a892-e8ca5f9136a5',
    'b9e20aef-6668-4ee5-9683-2244b637757e',
    '78e09b4e-1f99-44a5-9a06-dbb650a881d6',
    'Malcolm',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- MisterX, Last name
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'ad4d0808-ac79-4f73-b551-8974ff5edd3c',
    '03031790-0237-446b-9a75-ce91a5394ec1',
    '78e09b4e-1f99-44a5-9a06-dbb650a881d6',
    'Little',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Nonyes, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '94d4598f-fe18-421e-ac51-7d2225494cc1',
    'b4604114-7097-4f74-a4f2-6e3e50460536',
    '95d04544-62c5-4da2-bdc6-38c674e49295',
    'Nancy',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Nonyes, Last name
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'b282d03d-f277-4d33-949a-f60b1098e150',
    'dd137ee0-6b78-443a-8542-91399338d94e',
    '95d04544-62c5-4da2-bdc6-38c674e49295',
    'Commodore',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Ophelia, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '878ea415-8172-43dd-b8f7-62ed7e0326f2',
    '89dc4d7e-6c1c-4db3-81c8-785b1cbe2726',
    '57672a3e-ee2b-4e88-be43-6d5c71bffc3d',
    'Ophelia',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Ophelia, Last name
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '14ab5c7e-e1d8-4667-be01-b83de199dee4',
    'eef2a933-5611-4606-9d5c-7b045fc88dbf',
    '57672a3e-ee2b-4e88-be43-6d5c71bffc3d',
    'Rainbow',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Pimpampoum, First name
-- native / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '8078ac66-b5f2-4242-8c5b-d2035096cef7',
    'f3cc74d6-5fb4-4b5a-b608-232a8ffeb9b0',
    '7e30c890-b74f-4c70-9d1d-022e94b4f983',
    'Pamela',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- Pimpampoum, Last name
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'd264dc98-2bc1-4cd5-9798-1c27bbb78c3e',
    '3190dc4a-eec8-4792-a9dd-81c4a97c8567',
    '7e30c890-b74f-4c70-9d1d-022e94b4f983',
    'Nargacuga',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Email address
-- native
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'bda9b4bd-7955-410b-9875-6d3878775223',
    '4f46465a-b43b-49c3-9e8c-5871c3b3accd',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'l@l.me',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Other email address
-- native
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '7dc06978-e7c9-4055-af62-d5fa7b0fbc95',
    '7ff43513-de87-49bd-9186-46d840fbff1c',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'l@l.app',
    'DELETED',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Address
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '5ab1af0c-8f45-4c19-b0f1-0fcecf3e76f1',
    '9e14dd28-fea0-45ed-8b14-b0e44cf9333d',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    '219 rue Bellevue, Studio B, 50000 Saint-Lô',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Other address
-- native / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '10cc2530-0ab8-4de6-b104-ecccd878265d',
    '94350b03-3368-45a3-9431-ae480e21970b',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'something something Shadowbriar',
    'DELETED',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Birthday
-- pseudonative
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '557c7d3a-84ce-419e-8481-aebcc87be065',
    '308602f3-1ecc-4089-a9f8-5beda1ff6b7d',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'January 1',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Mother's birthday
-- pseudonative
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '2b96430e-ee87-4b8a-82a9-4bf3cbea24b6',
    '302aab4f-412c-4588-a804-fefd7af92f47',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'April 1',
    'DELETED',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Girlfriend's birthday
-- pseudonative / irl 
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'bcb15a93-6453-4bf6-a63b-072d3ab3180a',
    'f67ae4be-6c09-4d05-a0f4-a859c06756a5',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'August 1',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Crush's birthday
-- pseudonative / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'a5ad678f-90cb-4f0f-928b-87c16dc98db0',
    'beed9e53-0ff9-445c-8bfe-dd39ed0ae20a',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'November 1',
    'DELETED',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Birthdate
-- pseudonative / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'bbd40257-6d50-49b6-af14-bd9a8291e651',
    'd25f5552-9a9f-440b-860c-1591f59eec4f',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'January 1, 1990',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Mother's birthdate
-- pseudonative / irl
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'c5608724-0c14-4c2a-8c09-2c005c17ddd7',
    'c31920e6-6417-4786-beed-7642e0f846c5',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'April 1, 1960',
    'DELETED',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Girlfriend's birthdate
-- pseudonative
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '93f68f38-3455-4316-940e-aae39389bb49',
    '6d9d2ced-00ac-466a-bcd6-ee01bd390b03',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'August 1, 1990',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Crush's birthdate
-- pseudonative
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    'df587fd4-9345-4321-b55d-acc6f447ce45',
    'f70c608c-0112-4b27-97b6-8d82ac18550d',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'November 1, 2000',
    'DELETED',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Favorite anime character
-- custom / not shared / pinned
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '695b392c-d8ac-47af-a3fb-c8ad2bf61d68',
    '1c05f09d-64a3-4b3c-a276-eb88fa65be25',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'Kaidzuka Inaho',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Favorite anime waifu
-- custom / shared (1) / pinned -- (1 UserQuestionFriend 'DELETED')
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '5de019c9-c4b9-426b-ada7-ec48c4ab6fe9',
    '6435cb5e-68f9-4e9d-bcb5-aa7d1cce1771',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'Mikasa Ackerman',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Favorite anime series
-- custom / not shared
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '8d94a4e5-ee53-4013-b30a-e8be95ca653d',
    '70a7faaa-83de-4b9f-a32c-99ff4bbc3723',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'Mobile Suit Gundam 00',
    'LIVE',
    now(),
    now()
);

INSERT INTO Answers ( -- LePapier, Favorite anime franchise
-- custom / not shared
    answer_id,
    userquestion_id,
    user_id,
    answer_value,
    answer_state,
    answer_created_at,
    answer_updated_at
)
VALUES (
    '568a5fb9-9ec6-4bf5-a12d-9f30d1763123',
    '9441a1f6-34f1-404c-825c-a6e1dfed656f',
    '2640aaf6-20b5-497c-b980-fbee374830c2',
    'Mobile Suit Gundam',
    'DELETED',
    now(),
    now()
);


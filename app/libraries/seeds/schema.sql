-- SCHEMA
-- First to be input by hand on Vercel Postgres, and eventually programmatically along with the seeds through a JavaScript file.

CREATE TYPE user_state AS ENUM (
    'NONE',
    'LIVE',
    'DELETED',
    'DEACTIVATED'
); -- Done. 

CREATE TYPE user_status_title AS ENUM (
    'NONE',
    'WELCOMETOGREVENTS',
    'WELCOMEBACKTOGREVENTS'
); -- Done. 

CREATE TYPE user_status_dashboard AS ENUM (
    'NONE',
    'EMAILUPDATED',
    'PASSWORDUPDATED',
    'APPWIDENAMEUPDATED',
    'FRIENDCODEUPDATED',
    'TEMPORARYPASSWORDCHANGED',
    'NOWDEACTIVATED',
    'NOWREACTIVATED',
    'REDIRECTEDTODASHBOARD'
); -- Done.

CREATE TYPE user_status_personal_info AS ENUM (
    'NONE',
    'CRITERIAHIDDEN',
    'CRITERIAREVEALED',
    'CRITERIAPINNED',
    'CRITERIAUNPINNED',
    'STANDARDIZEDANSWERUPDATED',
    'STANDARDIZEDANSWERDELETED',
    'CUSTOMIZEDANSWERUPDATED',
    'CUSTOMIZEDANSWERDELETED',
    'NATIVECRITERIANOTIRLADDED',
    'NATIVECRITERIAIRLADDED',
    'PSEUDONATIVECRITERIANOTIRLADDED',
    'PSEUDONATIVECRITERIAIRLADDED',
    'PSEUDONATIVECRITERIAUPPEDTOIRL',
    'PSEUDONATIVECRITERIADOWNEDFROMIRL',
    'CUSTOMCRITERIAADDED',
    'CUSTOMCRITERIADELETED',
    'USERQUESTIONFRIENDADDED',
    'USERQUESTIONFRIENDDELETED',
    'REDIRECTEDTOPERSONALINFO'
); -- Done.

CREATE TABLE Users (
    user_id char(36) NOT NULL PRIMARY KEY,
    user_state user_state DEFAULT 'NONE' NOT NULL,
    user_status_title user_status_title DEFAULT 'NONE' NOT NULL,
    user_status_dashboard user_status_dashboard DEFAULT 'NONE' NOT NULL,
    user_status_personal_info user_status_personal_info DEFAULT 'NONE' NOT NULL,
    user_username varchar(50) UNIQUE NOT NULL,
    user_email varchar(50) UNIQUE NOT NULL,
    user_password varchar(100) NOT NULL,
    user_app_wide_name varchar(50) NOT NULL,
    user_friend_code char(12) UNIQUE NOT NULL,
    user_has_temporary_password boolean DEFAULT FALSE NOT NULL,
    user_created_at timestamp NOT NULL,
    user_updated_at timestamp NOT NULL
); -- Done.

CREATE TYPE contact_state AS ENUM (
    'NONE',
    'LIVE',
    'DELETED'
); -- Done.

CREATE TYPE contact_kind AS ENUM (
    'NONE',
    'FRIEND',
    'IRL'
); -- Done.

CREATE TYPE contact_process_relationship AS ENUM (
    'NONE',
    'SENTFRIEND',
    'SENTIRL',
    'ANNULFRIEND',
    'ANNULIRL'
); -- Done.

CREATE TYPE contact_status_relationship AS ENUM (
    'NONE',
    'SENTFRIEND',
    'SENTIRL', 
    'RECEIVEFRIEND',
    'RECEIVEIRL',
    'ANNULFRIEND',
    'ANNULIRL',
    'REFUSEDFRIEND',
    'REFUSEDIRL',
    'NOWFRIENDS',
    'NOWIRLS',
    'NOLONGERFRIENDS',
    'NOLONGERIRLS'
    'NOWBLOCKING',
    'NOWUNBLOCKING',
    'NOWBLOCKED',
    'NOWUNBLOCKED'
); -- Done.

CREATE TYPE contact_status_profile AS ENUM (
    'NONE',
    'FIRSTACCESSEDTHROUGHFIND',
    'REACCESSEDTHROUGHFIND'
); -- Done.

CREATE TYPE contact_status_mirror_profile AS ENUM (
    'NONE',
    'FIRSTACCESSTHROUGHFIND', -- I believe not needed
    'REACCESSTHROUGHFIND', -- I believe not needed
    'USERQUESTIONFRIENDPINNED',
    'USERQUESTIONFRIENDUNPINNED'
); -- from contact_status_other_profile to contact_status_mirror_profile

CREATE TABLE Contacts (
    contact_id char(36) NOT NULL PRIMARY KEY,
    user_first_id char(36) REFERENCES Users NOT NULL,
    user_last_id char(36) REFERENCES Users NOT NULL,
    contact_mirror_id char(36) REFERENCES Contacts NULL,
    contact_state contact_state DEFAULT 'NONE' NOT NULL,
    contact_kind contact_kind DEFAULT 'NONE' NOT NULL,
    contact_process_relationship contact_process_relationship DEFAULT 'NONE' NOT NULL,
    contact_status_relationship contact_status_relationship DEFAULT 'NONE' NOT NULL,
    contact_status_mirror_profile contact_status_mirror_profile DEFAULT 'NONE' NOT NULL,
    contact_blocking boolean DEFAULT FALSE NOT NULL,
    contact_created_at timestamp NOT NULL,
    contact_updated_at timestamp NOT NULL,
    contact_sent_friend_at timestamp NULL,
    contact_sent_irl_at timestamp NULL,
    contact_friend_at timestamp NULL,
    contact_irl_at timestamp NULL,
    contact_blocked_at timestamp NULL,
    UNIQUE (
        user_first_id, 
        user_last_id
    )
); -- Done.

CREATE TYPE question_state AS ENUM (
    'NONE',
    'LIVE',
    'DELETED'
); -- Done.

CREATE TYPE question_kind AS ENUM ( 
    'NONE',
    'NATIVE',
    'NATIVEIRL',
    'PSEUDO',
    'CUSTOM'
); -- Done.

CREATE TABLE Questions (
    question_id char(36) NOT NULL PRIMARY KEY,
    user_id char(36) REFERENCES Users NULL,
    question_state question_state DEFAULT 'NONE' NOT NULL,
    question_kind question_kind DEFAULT 'NONE' NOT NULL,
    question_name varchar(100) NOT NULL,
    question_is_suggested boolean DEFAULT FALSE NOT NULL,
    question_created_at timestamp NOT NULL,
    question_updated_at timestamp NOT NULL,
    UNIQUE (
        question_kind, 
        question_name
    )
); -- Done.

CREATE TYPE userquestion_state AS ENUM (
    'NONE',
    'LIVE',
    'DELETED',
    'HIDDEN'
); -- Done.

CREATE TYPE userquestion_kind AS ENUM (
    'NONE',
    'PSEUDONATIVE',
    'PSEUDONATIVEIRL'
); -- Done.

CREATE TABLE UserQuestions (
    userquestion_id char(36) NOT NULL PRIMARY KEY,
    user_id char(36) REFERENCES Users NOT NULL,
    question_id char(36) REFERENCES Questions NOT NULL,
    userquestion_state userquestion_state DEFAULT 'NONE' NOT NULL,
    userquestion_kind userquestion_kind DEFAULT 'NONE' NOT NULL,
    userquestion_is_pinned boolean DEFAULT FALSE NOT NULL,
    userquestion_created_at timestamp NOT NULL,
    userquestion_updated_at timestamp NOT NULL,
    userquestion_pinned_at timestamp NULL,
    userquestion_up_to_irl_at timestamp NULL,
    userquestion_down_from_irl_at timestamp NULL,
    UNIQUE (
        user_id, 
        question_id
    )
); -- Done.

CREATE TYPE userquestionfriend_state AS ENUM (
    'NONE',
    'LIVE',
    'DELETED'
); -- Done.

CREATE TABLE UserQuestionFriends (
    userquestionfriend_id char(36) NOT NULL PRIMARY KEY,
    userquestion_id char(36) REFERENCES UserQuestions NOT NULL,
    contact_id char(36) REFERENCES Contacts NOT NULL,
    userquestionfriend_state userquestionfriend_state DEFAULT 'NONE' NOT NULL,
    userquestionfriend_shared_to_friend boolean DEFAULT FALSE NOT NULL,
    userquestionfriend_pinned_by_friend boolean DEFAULT FALSE NOT NULL,
    userquestionfriend_created_at timestamp NOT NULL,
    userquestionfriend_updated_at timestamp NOT NULL,
    userquestionfriend_shared_at timestamp NULL,
    userquestionfriend_pinned_at timestamp NULL,

    UNIQUE (
        userquestion_id, 
        contact_id
    )
); -- Done.

CREATE TYPE answer_state AS ENUM (
    'NONE',
    'LIVE',
    'DELETED'
); -- Done.

CREATE TABLE Answers (
    answer_id char(36) NOT NULL PRIMARY KEY,
    userquestion_id char(36) UNIQUE REFERENCES UserQuestions NULL,
    user_id char(36) REFERENCES Users NULL,
    answer_state answer_state DEFAULT 'NONE' NOT NULL,
    answer_value varchar(200) NOT NULL,
    answer_created_at timestamp NOT NULL,
    answer_updated_at timestamp NOT NULL
); -- Done.


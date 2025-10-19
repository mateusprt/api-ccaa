DROP SCHEMA IF EXISTS ccaa;

CREATE SCHEMA ccaa;

CREATE TABLE ccaa.account (
  account_id uuid primary key,
  name text,
  email text,
  document text,
  password text
);
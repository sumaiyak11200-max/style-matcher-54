CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_user_profile_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_profile_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    height_cm integer NOT NULL,
    weight_kg integer NOT NULL,
    body_type text NOT NULL,
    skin_tone text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_profiles_body_type_check CHECK ((body_type = ANY (ARRAY['skinny'::text, 'fat'::text, 'skinny fat'::text, 'extreme fat'::text]))),
    CONSTRAINT user_profiles_height_cm_check CHECK (((height_cm >= 30) AND (height_cm <= 300))),
    CONSTRAINT user_profiles_skin_tone_check CHECK ((skin_tone = ANY (ARRAY['white'::text, 'brown'::text, 'black'::text, 'asian'::text]))),
    CONSTRAINT user_profiles_weight_kg_check CHECK (((weight_kg >= 2) AND (weight_kg <= 500)))
);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles update_user_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_user_profile_updated_at();


--
-- Name: user_profiles Anyone can create profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create profiles" ON public.user_profiles FOR INSERT WITH CHECK (true);


--
-- Name: user_profiles Anyone can read profiles by id; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read profiles by id" ON public.user_profiles FOR SELECT USING (true);


--
-- Name: user_profiles Anyone can update profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update profiles" ON public.user_profiles FOR UPDATE USING (true);


--
-- Name: user_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--



export const APP_NAME = 'Scrumly'
export const APP_TAGLINE = 'Daily Scrum Dashboard'
export const APP_VERSION = '1.0.0'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/"
export const API_BASE_URL = BASE_URL

export const REGISTER_USER = `v1/auth/register`;
export const SIGNIN_USER = `v1/auth/login`;

export const GET_USERS = `v1/users`;
export const GET_PROFILE = `v1/users/profile`;

export const GET_PROJECTS = `v1/projects`;
export const GET_TASKS = `v1/tasks`;

export const GET_TEAMS = `v1/teams`;
export const GET_DEPARTMENTS = `v1/departments`;


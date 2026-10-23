import test from 'node:test'
import assert from 'node:assert/strict'
import {registrationSchema,loginSchema,emailSchema} from '../app/lib/validation.ts'
import {authError} from '../app/lib/auth-errors.ts'
const valid={first_name:'Alex',last_name:'Morgan',email:'alex@example.com',password:'Strong Pass123',confirm_password:'Strong Pass123'}
test('registration accepts passphrases and preserves password whitespace',()=>{const p=' Strong Pass123 ';assert.equal(registrationSchema.parse({...valid,password:p,confirm_password:p}).password,p)})
test('mismatched confirmation points to the confirmation field',()=>{const r=registrationSchema.safeParse({...valid,confirm_password:'different'});assert.equal(r.success,false);assert.equal(r.error.issues[0].path[0],'confirm_password')})
test('password policy rejects weak values',()=>{for(const password of ['short','alllowercase','UPPERCASE123','NoNumbersHere'])assert.equal(registrationSchema.safeParse({...valid,password,confirm_password:password}).success,false)})
test('email and names normalize without mutating passwords',()=>{const p=registrationSchema.parse({...valid,email:' alex@example.com ',first_name:' Alex '});assert.equal(p.email,'alex@example.com');assert.equal(p.first_name,'Alex')})
test('login does not apply new registration password requirements',()=>{assert.equal(loginSchema.safeParse({email:valid.email,password:'legacy'}).success,true)})
test('recovery rejects invalid email',()=>{assert.equal(emailSchema.safeParse('not-an-email').success,false)})
test('credential errors do not reveal whether an account exists',()=>{assert.equal(authError({code:'auth/user-not-found'}),authError({code:'auth/wrong-password'}))})
test('backend failures are errors, not success confirmations',()=>{assert.match(authError({code:'auth/network-request-failed'}),/Couldn’t connect/);assert.match(authError({code:'permission-denied'}),/storage is unavailable/)})
test('provider setup failures suggest the account-free demo',()=>{assert.match(authError({code:'auth/unauthorized-domain'}),/demo without an account/)})

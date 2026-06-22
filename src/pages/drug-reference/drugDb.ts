import { DrugDatabase } from './types';
import { ICU_DRUGS as DA } from './drugDbA';
import { ICU_DRUGS as DB } from './drugDbB';
import { ICU_DRUGS as DC } from './drugDbC';
import { ICU_DRUGS as DD } from './drugDbD';
import { ICU_DRUGS as DE } from './drugDbE';
import { ICU_DRUGS as DF } from './drugDbF';

export const ICU_DRUGS: DrugDatabase = {
  ...DA,
  ...DB,
  ...DC,
  ...DD,
  ...DE,
  ...DF
};

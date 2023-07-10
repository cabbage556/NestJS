import common from './common';
import local from './local';
import dev from './dev';
import prod from './prod';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

const phase = process.env.NODE_ENV;

// phase 값에 따라 적절한 환경 변수 값 저장
let conf = {};

if (phase === 'local') {
  conf = local;
} else if (phase === 'dev') {
  conf = dev;
} else if (phase === 'prod') {
  conf = prod;
}

// YAML 파일 로딩
const yamlConfig: Record<string, any> = yaml.load(
  readFileSync(`${process.cwd()}/src/envs/config.yaml`, 'utf-8'),
);

// common과 conf의 환경 변수 값을 합쳐서 결과값으로 주는 함수 리턴
export default () => ({
  ...common,
  ...conf,
  ...yamlConfig, // 기존 설정 마지막에 합치기
});

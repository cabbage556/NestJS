import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

// multerOption 객체 선언
export const multerOption = {
  // 디스크 스토리지 사용
  // 디스크에 파일을 저장하도록 diskStorage 타입의 객체를 만든다.
  // destination: 파일 저장 위치 지정
  // filename: 저장될 파일명 지정
  storage: diskStorage({
    // 파일 저장 경로 설정
    // 파일의 저장 경로는 최상단 경로의 [uploads] 디렉터리이다.
    destination: join(__dirname, '..', 'uploads'),
    // 파일명 설정
    // 파일명은 randomUUID 함수로 랜덤한 이름을 지어주고, extname 함수로 파일의 확장자를 붙여준다.
    // 보안을 위해 파일을 저장할 때는 랜덤한 값으로 변경해 저장하는 것이 좋다.
    filename: (req, file, cb) => {
      cb(null, randomUUID() + extname(file.originalname));
    },
  }),
};

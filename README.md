# 학습을 위해 PUSH할때마다 README.MD가 업데이트 됩니다. 
***


### 테스트주도개발(TDD)로 만드는 NodeJS API 서버 코드입니다.

- api단위 test를 위해 superTest library를 설치합니다.
- index.js의 app.get('/users')를 테스트하기위해 app을 모듈로 exports합니다.
- index.spec.js를 만들어 기본적인 작동 테스트를 해봅니다.
- package.json "scripts"에 test코드를 삽입합니다. 
	"mocha index.spec.js"
---
### 첫 API 테스트 만들기

성공시
- 유저 객체를 담은 배열로 응답한다.
- 최대 limit 갯수만큼 응답한다.

실패시
- limit이 숫자형이 아니면 400을 응답한다.
---

### GET /users/:id

Success
- id가 1인 유저 객체를 반환한다.

Error
- id가 숫자가 아닐경우 400으로 응답한다.
- id로 유저를 찾을수 없을경우 404로 응답한다.
---

### DELETE /users/:id

Success
- 204를 응답한다.

Error
- id가 숫자가 아닐경우 400으로 응답한다.
---

### POST /users

Success
- 201 상태코드를 반환한다.
- 생성된 유저 객체를 반환한다.
- 입력한 name을 반환한다.

Error
- name 파라메터 누락시 400을 반환한다.
- name이 중복일 경우 409를 반환한다.
---

### PUT /users/:id

Success
- 변경된 name을 응답한다.

Error
- 정수가 아닌 id일 경우 400 응답.
- name이 없을 경우 400 응답.
- 없는 유저일 경우 404 응답.
- 이름이 중복일 경우 409 응답.
---

### 코드 리펙토링

- 기존 index.js와 index.spec.js를 분리해서 api/user/폴더 하단에 정리한다.
- /api/user/ 에는 index.js, user.ctrl.js, user.spec.js 세가지로 정리한다.
- index.js에는 라우팅 설정 로직
- user.ctrl.js에는 실제 api 로직이 들어가며
- user.spec.js에는 api로직들의 테스트 코드가 들어가게 된다.

---

### ORM

- 데이터베이스를 객체로 추상화해 논것을 ORM(Object Relational Mapping)이라고 한다.
- 쿼리를 직접 작성하는 대신 ORM의 메소드로 데이터를 관리할 수 있는 것이 장점이다.
- 노드에서 SQL ORM은 시퀄라이져(Sequelize)가 있다.

---

## 모델

- 데이터베이스 테이블을 ORM으로 추상화한것을 모델이라고 한다.
- 우리가 사용할 유저 모델을 만들어보자
	sequelize.define(): 모델 정의
	sequelize.sync(): 데이터베이스 연동

---

## index 컨트롤러와 DB 연동

- 기존 리턴값인 배열을 삭제하고 DB와 연동해서 데이터를 전송한다.
- describe, it 에 .only함수를 사용하면 해당 테스트만 실행한다. 
- findAll 함수로 값을 json형식으로 리턴한다 

---

## show 컨트롤러와 DB 연동

- package.json파일 안에 test script에서 mocha 명령어를 돌릴때 -w 옵션을 주면 자동으로 테스트를 한다.
- findOne 함수를 이용해서 id값을 체크한 뒤 json으로 리턴한다.

---

## destroy 컨트롤러와 DB 연동

- destroy 함수를 이용해서 입력받은 id값을 삭제한다. 

---

## create 컨트롤러와 DB 연동

- models.js에서 DB 설정에서 unique: true를 주면 중복값으로 저장하지 않는다.
- DB 초기화 및 싱크를 각 describe 마다 넣어줘 DB 초기화 및 싱크를 진행한다. 
- create 함수를 통해 name값을 전달하고 then으로 받아서 성공시 201을 반환하고
- name 중복으로 인한 실패시 나타나는 에러값을 체크해서 409를 반환해준다. 

---

## update 컨트롤러와 DB 연동

- findOne 함수를 통해서 id값을 체크한뒤 
- 일치하는 user값이 없으면 404를 리턴한다.
- user.name에 받은 name값을 넣는다
- 그후 user.save()함수를 실행한다.
- 성공하면 user값을 리턴한다.
- name 중복으로 인한 실패시 나타나는 에러값을 체크해서 409를 반환해준다. 
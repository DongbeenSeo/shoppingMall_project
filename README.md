# FDS 9기 중간 프로젝트 템플릿

이 저장소를 중간 프로젝트에서 템플릿으로 사용할 수 있습니다. 빌드 도구로 [Parcel](https://parceljs.org/)을 사용하고 있으며, [create-react-app](https://github.com/facebook/create-react-app)에서 사용하는 [Babel](http://babeljs.io/) 프리셋인 [babel-preset-react-app](https://github.com/facebook/create-react-app/tree/master/packages/babel-preset-react-app)을 통해 여러 최신 문법을 사용할 수 있도록 설정되어 있습니다.

# Database 설계

- user
  - ID 1번은 관리자 계정 나머지는 Guest계정
  - 구매 기능구현을 위해 가상머니를 가지고 있다.
  - Guest들은 장바구니 속성을 가지고 있고 구매완료하면 목록을 삭제

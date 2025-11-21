import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const locales = {
  ko: 'ko',
  en: 'en',
  ja: 'ja',
} as const;

export type Locale = typeof locales[keyof typeof locales];

const resources = {
  ko: {
    translation: {
      title: '공공 와이파이 지도',
      appName: 'Wapple',
      subtitle: '공공 와이파이를 찾고 저장하며 후기를 남겨보세요.',
      login: {
        google: '구글로 로그인',
        emailLabel: '이메일',
        passwordLabel: '비밀번호',
        signIn: '로그인',
        orEmail: '또는 이메일로 로그인',
        registerLink: '회원가입',
        noAccount: '계정이 없으신가요? 회원가입 후 더 많은 기능을 이용해보세요.',
      },
      register: {
        title: '회원가입',
        subtitle: '닉네임으로 활동하고 다른 사용자와 후기를 공유하세요.',
        nickname: '닉네임',
        email: '이메일',
        password: '비밀번호',
        signup: '회원가입',
        alreadyAccount: '이미 계정이 있나요?',
      },
      selected: {
        noSelection: '와이파이를 선택하면 상세 정보가 여기에 표시됩니다.',
        backToSearch: '검색으로 돌아가기',
        savedBadge: '저장됨',
        saveButton: {
          save: '이 와이파이 저장',
          cancel: '저장 취소',
        },
        clearSelection: '선택 해제',
      },
      save: {
        loginRequired: '저장하려면 로그인이 필요합니다.',
        cancelLoginRequired: '저장 취소하려면 로그인이 필요합니다.'
      },
      comments: {
        title: '댓글',
        placeholder: '댓글을 입력하세요',
        loginAlert: '댓글을 작성하려면 로그인이 필요합니다.',
        submit: '댓글 등록',
        subtitle: '이 와이파이에 대한 후기를 남겨보세요.',
        reply: '답글',
        replyPlaceholder: '답글을 입력하세요',
        replyCancel: '취소',
        replyPost: '등록',
        noComments: '아직 댓글이 없습니다.'
      },
      home: {
        radiusTitle: '반경 설정',
        gotoSavedPage: '저장된 와이파이 페이지로 이동'
      },
      saved: {
        title: '저장된 와이파이',
        header: '[ 저장된 와이파이 ]',
        noSaved: '저장된 와이파이가 없습니다.',
        backToHome: '홈으로 돌아가기'
      },
      actions: {
        delete: '삭제',
        clearAll: '전체 삭제',
        logout: '로그아웃'
      },
      savedDetail: {
        commentsCount: '댓글 {{count}}',
        locationPrefix: '저장 위치 기준:',
        clickInfo: '※ 클릭하면 지도에서 확인할 수 있습니다.'
      },
      search: '위치 검색',
      searchPlaceholder: '주소 또는 장소명을 입력하세요',
      currentLocation: '현재 위치',
      radius: '반경',
      meters: 'm',
      wifiPoints: '와이파이 지점',
      noResults: '검색 결과가 없습니다',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      name: '이름',
      address: '주소',
      provider: '제공자',
      installationType: '설치 유형',
      installationFloor: '설치 층',
      serviceType: '서비스 유형',
      close: '닫기',
      useDefaultLocation: '기본 위치(서울)를 사용하시겠습니까?',
      refreshCurrentView: '현재 화면에서 검색',
    },
  },
  en: {
    translation: {
      title: 'Public WiFi Map',
      appName: 'Wapple',
      subtitle: 'Find, save and review public WiFi spots.',
      login: {
        google: 'Sign in with Google',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        signIn: 'Sign in',
        orEmail: 'or sign in with email',
        registerLink: 'Register',
        noAccount: 'No account? Register to unlock more features.',
      },
      register: {
        title: 'Register',
        subtitle: 'Choose a nickname and share reviews with others.',
        nickname: 'Nickname',
        email: 'Email',
        password: 'Password',
        signup: 'Register',
        alreadyAccount: 'Already have an account?',
      },
      selected: {
        noSelection: 'Select a WiFi to see details here.',
        backToSearch: 'Back to search',
        savedBadge: 'Saved',
        saveButton: {
          save: 'Save this WiFi',
          cancel: 'Cancel save',
        },
        clearSelection: 'Clear selection',
      },
      save: {
        loginRequired: 'You need to sign in to save.',
        cancelLoginRequired: 'You need to sign in to cancel saved item.'
      },
      comments: {
        title: 'Comments',
        placeholder: 'Write a comment',
        loginAlert: 'You need to sign in to post comments.',
        submit: 'Post comment',
        subtitle: 'Share your experience about this WiFi.',
        reply: 'Reply',
        replyPlaceholder: 'Write a reply',
        replyCancel: 'Cancel',
        replyPost: 'Post',
        noComments: 'No comments yet.'
      },
      home: {
        radiusTitle: 'Radius settings',
        gotoSavedPage: 'Go to saved WiFi page'
      },
      saved: {
        title: 'Saved WiFi',
        header: '[ Saved WiFi ]',
        noSaved: 'No saved WiFi.',
        backToHome: 'Back to home'
      },
      actions: {
        delete: 'Delete',
        clearAll: 'Clear all',
        logout: 'Sign out'
      },
      savedDetail: {
        commentsCount: 'Comments {{count}}',
        locationPrefix: 'Saved at:',
        clickInfo: '※ Click to view on the map.'
      },
      search: 'Search Location',
      searchPlaceholder: 'Enter address or place name',
      currentLocation: 'Current Location',
      radius: 'Radius',
      meters: 'm',
      wifiPoints: 'WiFi Points',
      noResults: 'No results found',
      loading: 'Loading...',
      error: 'An error occurred',
      name: 'Name',
      address: 'Address',
      provider: 'Provider',
      installationType: 'Installation Type',
      installationFloor: 'Installation Floor',
      serviceType: 'Service Type',
      close: 'Close',
      useDefaultLocation: 'Use default location (Seoul)?',
      refreshCurrentView: 'Search Here',
    },
  },
  ja: {
    translation: {
      title: '公共WiFiマップ',
      appName: 'Wapple',
      subtitle: '公共WiFiを見つけて保存し、レビューを共有しましょう。',
      login: {
        google: 'Googleでログイン',
        emailLabel: 'メール',
        passwordLabel: 'パスワード',
        signIn: 'ログイン',
        orEmail: 'またはメールでログイン',
        registerLink: '登録',
        noAccount: 'アカウントがありませんか？ 登録して機能を利用してください。',
      },
      register: {
        title: '登録',
        subtitle: 'ニックネームで活動し、他のユーザーとレビューを共有しましょう。',
        nickname: 'ニックネーム',
        email: 'メール',
        password: 'パスワード',
        signup: '登録',
        alreadyAccount: 'すでにアカウントをお持ちですか？',
      },
      selected: {
        noSelection: 'WiFiを選択すると詳細がここに表示されます。',
        backToSearch: '検索に戻る',
        savedBadge: '保存済み',
        saveButton: {
          save: 'このWiFiを保存',
          cancel: '保存を取り消す',
        },
        clearSelection: '選択解除',
      },
      save: {
        loginRequired: '保存するにはログインが必要です。',
        cancelLoginRequired: '保存を取り消すにはログインが必要です。'
      },
      comments: {
        title: 'コメント',
        placeholder: 'コメントを入力してください',
        loginAlert: 'コメントを書くにはログインが必要です。',
        submit: 'コメントを投稿',
        subtitle: 'このWiFiについてのレビューを共有しましょう。',
        reply: '返信',
        replyPlaceholder: '返信を入力してください',
        replyCancel: 'キャンセル',
        replyPost: '投稿',
        noComments: 'まだコメントはありません。'
      },
      home: {
        radiusTitle: '半径設定',
        gotoSavedPage: '保存済みWiFiページへ移動'
      },
      saved: {
        title: '保存済みWiFi',
        header: '[ 保存済みWiFi ]',
        noSaved: '保存済みのWiFiはありません。',
        backToHome: 'ホームに戻る'
      },
      actions: {
        delete: '削除',
          clearAll: 'すべて削除',
          logout: 'ログアウト'
      },
      savedDetail: {
        commentsCount: 'コメント {{count}}',
        locationPrefix: '保存場所:',
        clickInfo: '※ クリックすると地図で確認できます。'
      },
      search: '位置検索',
      searchPlaceholder: '住所または場所名を入力してください',
      currentLocation: '現在地',
      radius: '半径',
      meters: 'm',
      wifiPoints: 'WiFiポイント',
      noResults: '検索結果がありません',
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      name: '名前',
      address: '住所',
      provider: 'プロバイダー',
      installationType: '設置タイプ',
      installationFloor: '設置階',
      serviceType: 'サービスタイプ',
      close: '閉じる',
      useDefaultLocation: 'デフォルトの場所（ソウル）を使用しますか？',
      refreshCurrentView: 'ここで検索',
    },
  },
};

// pick up saved language from localStorage when available
const savedLang = (typeof window !== 'undefined' && localStorage.getItem('appLanguage')) as
  | Locale
  | null;

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang ?? 'ko',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const setAppLanguage = (lang: Locale) => {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('appLanguage', lang);
  }
};

export default i18n;

const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
};

const redirectIfMobile = () => {
    if (isMobile()) {
        alert("모바일 장치에서는 접근할 수 없습니다.");
        window.location.href = "https://sisyphusj.me/not-allowed.html"; // 접근 차단 메시지 페이지로 리다이렉트
    }
};

export { isMobile, redirectIfMobile };

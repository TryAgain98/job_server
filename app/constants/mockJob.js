const moment = require("moment");
exports.jobs = [
    {
        id: 1,
        name: "Lập Trình Viên PHP /Laravel (Junior/Middle Level)",
        salary: "15-30 triệu",
        recruit_quantity: "5 người",
        sex: "Không yêu cầu",
        age: "Không yêu cầu",
        english_level: "đọc hiểu cơ bản",
        experience: "<p>- Có ít nhất 1 năm kinh nghiệm với PHP, MySQL và Laravel. </p><p>- Có khả năng làm việc độc lập và hướng dẫn nhóm.</p><p>- Đam mê, nhiệt huyết, dám thử thách, dám thành công.</p><p>- Có khả năng đề xuất, đưa ra giải pháp cho các vấn đề của project.</p><p>- Có khả năng xây dựng kiến trúc hệ thống, tối ưu hệ thống.</p>",
        other_requirements: "Biết DevOps là 1 lợi thế.",
        contact_info: "Liên hệ số điện thoại để biết thêm thông tin: 0123456789",
        area: "Hà Nội",
        work_address: "- Hà Nội: Tầng 2, tòa CIC số 2 phố Nguyễn Thị Duệ, Yên Hòa, Cầu Giấy, Hà Nội, Cầu Giấy",
        start_time: new Date().getTime(),
        end_time: moment(new Date()).add(30, 'd').valueOf(),
        careerId: 1,
        companyId: 1,
        level: "Junior"
    },
    {
        id: 2,
        name: "Java Developer (All Levels)",
        salary: "30 triệu",
        recruit_quantity: "50 người",
        sex: "Không yêu cầu",
        age: "Không yêu cầu",
        english_level: "đọc hiểu cơ bản",
        experience: "<p>- Có ít nhất 1 năm kinh nghiệm với PHP, MySQL và Laravel. </p><p>- Có khả năng làm việc độc lập và hướng dẫn nhóm.</p><p>- Đam mê, nhiệt huyết, dám thử thách, dám thành công.</p><p>- Có khả năng đề xuất, đưa ra giải pháp cho các vấn đề của project.</p><p>- Có khả năng xây dựng kiến trúc hệ thống, tối ưu hệ thống.</p>",
        other_requirements: "Good English communication skill and stakeholder management",
        contact_info: "Liên hệ số điện thoại để biết thêm thông tin: 0123456789",
        area: "Hà Nội",
        work_address: "- Hà Nội: Tầng 2, tòa CIC số 2 phố Nguyễn Thị Duệ, Yên Hòa, Cầu Giấy, Hà Nội, Cầu Giấy",
        start_time: new Date().getTime(),
        end_time: moment(new Date()).add(30, 'd').valueOf(),
        careerId: 2,
        companyId: 2,
        level: "Senior"
    }
]
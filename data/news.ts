export interface NewsItem {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  date: string;
  category: string;
  categoryEn: string;
  thumbnail: string;
  galleryImages?: string[];
  imageCaption?: string;
  imageCaptionEn?: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
}

export const news: NewsItem[] = [
  {
    id: "ha-thuy-sa-lan-2026",
    title: "Hữu Thành hạ thủy thành công sà lan chuyên dụng",
    titleEn: "Huu Thanh successfully launches a specialized barge",
    slug: "huu-thanh-ha-thuy-thanh-cong-sa-lan-chuyen-dung",
    date: "2026-07-11",
    category: "Tin tức",
    categoryEn: "News",
    thumbnail: "/images/tin-tuc/ha-thuy-sa-lan-chuyen-dung-01.jpg",
    galleryImages: ["/images/tin-tuc/ha-thuy-sa-lan-chuyen-dung-02.jpg"],
    imageCaption: "Hình ảnh: Sà lan chuyên dụng của Công ty Cổ phần Xây dựng Hữu Thành trong ngày hạ thủy thành công 11/7/2026 tại TP.HCM.",
    imageCaptionEn: "Image: Huu Thanh Construction Joint Stock Company's specialized barge during its successful launch in Ho Chi Minh City on July 11, 2026.",
    excerpt: "Ngày 11/7/2026, Công ty Cổ phần Xây dựng Hữu Thành đã hạ thủy thành công sà lan chuyên dụng tại TP.HCM. Sự kiện đánh dấu một cột mốc quan trọng trong quá trình đầu tư, hoàn thiện hệ thống thiết bị phục vụ thi công, đồng thời khẳng định năng lực tổ chức và triển khai các dự án giao thông hàng hải của doanh nghiệp.",
    excerptEn: "On July 11, 2026, Huu Thanh Construction Joint Stock Company successfully launched a specialized barge in Ho Chi Minh City. The event marked an important milestone in the company's investment and development of construction equipment, while affirming its capability to organize and deliver maritime transport projects.",
    content: `Sà lan chuyên dụng được hạ thủy có chiều dài 58,25 m, chiều rộng 18,25 m, chiều cao mạn 3,20 m, chiều chìm thiết kế 2,40 m, tổng dung tích 906 GT và trọng tải toàn phần 1.727,30 tấn. Với mặt boong rộng và tải trọng lớn, phương tiện đáp ứng nhu cầu tập kết thiết bị, vật tư phục vụ thi công các công trình giao thông hàng hải.

Quá trình hạ thủy được đội ngũ kỹ sư, cán bộ kỹ thuật và công nhân phối hợp triển khai chặt chẽ, tuân thủ phương án kỹ thuật và các yêu cầu an toàn. Sà lan rời triền, tiếp nước ổn định và được đưa về vị trí neo đậu an toàn, hoàn tất thành công các bước quan trọng của kế hoạch hạ thủy.

Việc đưa Sà lan chuyên dùng mới vào khai thác giúp Hữu Thành chủ động hơn về phương tiện thiết bị phục vụ thi công các công trình, dự án cảng biển. Đây cũng là bước đầu tư quan trọng nhằm tăng cường năng lực thiết bị thi công đáp ứng các dự án quy mô lớn trong thời gian tới.

Sự kiện hạ thủy thành công sà lan chuyên dùng tiếp tục khẳng định định hướng chú trọng đầu tư trang thiết bị thi công, phát triển đội ngũ thiết bị thi công thủy của Công ty Cổ phần Xây dựng Hữu Thành. Với nền tảng thiết bị ngày càng lớn mạnh cùng đội ngũ cán bộ, kỹ thuật giàu kinh nghiệm, Hữu Thành sẵn sàng đồng hành trong những công trình, dự án giao thông hàng hải lớn, trọng điểm, qua đó góp phần tạo nên các giá trị bền vững cho cộng đồng và xã hội.`,
    contentEn: `The specialized barge has a length of 58.25 m, a width of 18.25 m, a moulded depth of 3.20 m, a design draught of 2.40 m, a gross tonnage of 906 GT, and a total deadweight of 1,727.30 tonnes. With its wide deck and large load capacity, the vessel can accommodate equipment and materials for maritime transport construction works.

The launch was closely coordinated by engineers, technical staff, and workers in compliance with the approved technical method and safety requirements. The barge left the slipway, entered the water stably, and was moved to a safe anchorage, successfully completing the key stages of the launch plan.

Putting the new specialized barge into operation gives Huu Thanh greater control over the equipment used for port and maritime construction projects. It is also an important investment that strengthens the company's construction equipment capacity for larger-scale projects in the years ahead.

The successful launch further affirms Huu Thanh Construction Joint Stock Company's focus on investing in construction equipment and developing its marine construction fleet. With an increasingly robust equipment base and an experienced technical team, Huu Thanh is ready to contribute to major and nationally significant maritime transport projects, creating sustainable value for communities and society.`,
  },
  {
    id: "2",
    title: "Hữu Thành nhận giải thưởng Nhà thầu uy tín năm 2024",
    titleEn: "Huu Thanh receives Reputable Contractor Award 2024",
    slug: "huu-thanh-nhan-giai-thuong-nha-thau-uy-tin-2024",
    date: "2024-10-20",
    category: "Giải thưởng",
    categoryEn: "Awards",
    thumbnail: "/images/du-an/huu-thanh-co_132827983464005202.jpg",
    excerpt: "Tại lễ trao giải thưởng xây dựng Việt Nam năm 2024, Hữu Thành vinh dự nhận danh hiệu Nhà thầu uy tín toàn quốc.",
    excerptEn: "At the 2024 Vietnam Construction Awards ceremony, Huu Thanh was honored with the title of National Reputable Contractor.",
    content: `Ngày 20/10/2024, tại lễ trao giải thưởng Xây dựng Việt Nam do Bộ Xây dựng và Hiệp hội Nhà thầu Xây dựng Việt Nam (VACC) đồng tổ chức, Công ty Cổ phần Xây dựng Hữu Thành đã vinh dự nhận danh hiệu "Nhà thầu uy tín toàn quốc năm 2024" trong lĩnh vực thi công thủy công và cảng biển.

Giải thưởng được bình chọn dựa trên các tiêu chí khắt khe bao gồm: năng lực tài chính, kinh nghiệm thi công, chất lượng công trình hoàn thành, cam kết tiến độ và trách nhiệm với cộng đồng. Hữu Thành là một trong số ít doanh nghiệp vừa đạt giải thưởng cao nhất trong nhóm ngành thủy công, thể hiện vị thế dẫn đầu của công ty trong lĩnh vực chuyên biệt này.

Trong năm 2024, Hữu Thành đã hoàn thành 18 gói thầu lớn với tổng giá trị hơn 850 tỷ đồng, không có gói thầu nào bị phạt tiến độ hay khiếu kiện chất lượng. Tỷ lệ tái ký hợp đồng với khách hàng cũ đạt trên 75%, phản ánh mức độ tin tưởng và hài lòng cao của các chủ đầu tư.

Ông Nguyễn Văn Thành, Chủ tịch HĐQT, chia sẻ: "Giải thưởng này là sự ghi nhận xứng đáng cho toàn bộ tập thể cán bộ, kỹ sư và công nhân Hữu Thành — những người đã không ngừng nỗ lực, vượt qua mọi thách thức để tạo ra những công trình bền vững cho đất nước."`,
    contentEn: `On October 20, 2024, at the Vietnam Construction Awards ceremony co-organized by the Ministry of Construction and the Vietnam Association of Construction Contractors (VACC), Huu Thanh Construction Joint Stock Company was honored to receive the title of "National Reputable Contractor 2024" in the field of hydraulic and port construction.

The award is based on strict criteria including financial capacity, construction experience, quality of completed works, schedule commitment, and community responsibility. Huu Thanh is one of the few enterprises to receive the top award in the hydraulic engineering sector, demonstrating the company's leading position in this specialized field.

In 2024, Huu Thanh completed 18 major contracts with a total value of over 850 billion VND, with no contract subject to schedule penalties or quality disputes. The contract renewal rate with existing clients exceeded 75%, reflecting the high level of trust and satisfaction among investors.

Mr. Nguyen Van Thanh, Chairman of the Board of Directors, shared: "This award is a well-deserved recognition for the entire team of staff, engineers, and workers at Huu Thanh — people who have continuously strived and overcome every challenge to create lasting works for the nation."`,
  },
  {
    id: "3",
    title: "Khởi công dự án nạo vét luồng hàng hải Định An giai đoạn 2",
    titleEn: "Groundbreaking of Dinh An Maritime Channel Dredging Phase 2",
    slug: "khoi-cong-nao-vet-luong-hang-hai-dinh-an-giai-doan-2",
    date: "2024-09-05",
    category: "Dự án",
    categoryEn: "Projects",
    thumbnail: "/images/du-an/huu-thanh-co_132828922419342655.jpg",
    excerpt: "Ngày 5/9/2024, Công ty Hữu Thành chính thức khởi công giai đoạn 2 dự án nạo vét luồng hàng hải Định An - Cần Thơ.",
    excerptEn: "On September 5, 2024, Huu Thanh Co. officially broke ground on Phase 2 of the Dinh An – Can Tho maritime channel dredging project.",
    content: `Sáng ngày 5/9/2024, Công ty Cổ phần Xây dựng Hữu Thành đã tổ chức lễ khởi công giai đoạn 2 dự án nạo vét luồng hàng hải Định An – Cần Thơ. Sự kiện có sự tham dự của đại diện Cục Hàng hải Việt Nam, UBND tỉnh Trà Vinh và các đối tác chiến lược của công ty.

Giai đoạn 2 của dự án có tổng chiều dài luồng nạo vét khoảng 8,5 km, với chiều sâu thiết kế đạt -6,5 m so với mực nước 0, cho phép tàu có trọng tải đến 10.000 DWT ra vào thuận lợi. Hữu Thành sẽ huy động 4 tàu hút bùn tự hành hiện đại cùng đội tàu hỗ trợ, đảm bảo hoàn thành trong vòng 9 tháng.

Dự án sử dụng công nghệ định vị GPS-RTK tích hợp với phần mềm Hypack để kiểm soát độ chính xác nạo vét trong thời gian thực, giúp đảm bảo đúng cao độ thiết kế và tránh nạo vét thừa gây lãng phí. Đây là lần đầu tiên công nghệ này được áp dụng đồng bộ trên toàn tuyến luồng tại khu vực đồng bằng sông Cửu Long.

Luồng Định An sau khi hoàn thành nạo vét sẽ giúp giảm chi phí vận tải đường thủy khoảng 15–20% cho các doanh nghiệp xuất nhập khẩu tại vùng ĐBSCL, đồng thời tạo điều kiện cho Cảng Cần Thơ đón các tàu lớn hơn, thúc đẩy phát triển kinh tế toàn vùng.`,
    contentEn: `On the morning of September 5, 2024, Huu Thanh Construction Joint Stock Company held the groundbreaking ceremony for Phase 2 of the Dinh An – Can Tho maritime channel dredging project. The event was attended by representatives from the Vietnam Maritime Administration, the People's Committee of Tra Vinh Province, and the company's strategic partners.

Phase 2 of the project covers a total dredging channel length of approximately 8.5 km, with a design depth of -6.5 m relative to zero water level, allowing vessels with up to 10,000 DWT to navigate freely. Huu Thanh will mobilize 4 modern self-propelled dredgers along with a support fleet to ensure completion within 9 months.

The project employs GPS-RTK positioning technology integrated with Hypack software for real-time dredging accuracy control, ensuring the correct design elevation is maintained and avoiding over-dredging waste. This marks the first time this technology has been comprehensively applied across an entire channel in the Mekong Delta region.

Upon completion, the Dinh An channel will help reduce waterway transport costs by approximately 15–20% for import-export enterprises in the Mekong Delta, while enabling Can Tho Port to receive larger vessels and boosting economic development across the entire region.`,
  },
  {
    id: "4",
    title: "Hội thảo kỹ thuật: Ứng dụng công nghệ GPS-RTK trong thi công thủy công",
    titleEn: "Technical Seminar: GPS-RTK Technology in Hydraulic Construction",
    slug: "hoi-thao-gps-rtk-trong-thi-cong-thuy-cong",
    date: "2024-08-15",
    category: "Kỹ thuật",
    categoryEn: "Technical",
    thumbnail: "/images/du-an/huu-thanh-co_132828238384876503.jpg",
    excerpt: "Công ty tổ chức hội thảo nội bộ về ứng dụng công nghệ GPS-RTK trong thi công thủy công, nâng cao chất lượng và độ chính xác.",
    excerptEn: "The company held an internal seminar on applying GPS-RTK technology in hydraulic construction to improve quality and precision.",
    content: `Ngày 15/8/2024, Công ty Cổ phần Xây dựng Hữu Thành tổ chức hội thảo kỹ thuật nội bộ với chủ đề "Ứng dụng công nghệ GPS-RTK trong thi công thủy công và nạo vét". Sự kiện thu hút hơn 80 kỹ sư, cán bộ kỹ thuật và chỉ huy công trường tham gia.

GPS-RTK (Real-Time Kinematic) là công nghệ định vị vệ tinh có độ chính xác centimet, cho phép xác định vị trí tàu và thiết bị thi công trong thời gian thực với sai số không quá 2 cm. Khi tích hợp với các phần mềm chuyên dụng như Hypack hay Trimble Dredge, hệ thống tự động kiểm soát độ sâu nạo vét và vị trí đóng cọc, giảm thiểu sai sót do yếu tố con người.

Qua thực tế triển khai tại dự án Cảng Thị Vải và kênh Tri Tôn, công nghệ này đã giúp Hữu Thành tiết kiệm trung bình 12% khối lượng vật liệu do giảm nạo vét thừa, đồng thời rút ngắn 18% thời gian kiểm tra nghiệm thu so với phương pháp đo đạc truyền thống.

Hội thảo cũng thảo luận về lộ trình đào tạo nhân lực vận hành thiết bị công nghệ cao, kế hoạch trang bị thêm 6 trạm GPS-RTK cố định tại các khu vực thi công trọng điểm trong năm 2025, và định hướng ứng dụng drone đo đạc địa hình kết hợp GPS để rút ngắn thời gian khảo sát từ 3 ngày xuống còn 4 giờ.`,
    contentEn: `On August 15, 2024, Huu Thanh Construction Joint Stock Company organized an internal technical seminar on the topic of "Applying GPS-RTK Technology in Hydraulic Construction and Dredging." The event attracted more than 80 engineers, technical staff, and site managers.

GPS-RTK (Real-Time Kinematic) is a satellite positioning technology with centimeter-level accuracy, enabling real-time determination of vessel and equipment positions with an error margin of no more than 2 cm. When integrated with specialized software such as Hypack or Trimble Dredge, the system automatically controls dredging depth and pile driving positions, minimizing errors caused by human factors.

Based on implementation experience at the Thi Vai Port and Tri Ton Canal projects, this technology has helped Huu Thanh save an average of 12% in material volume by reducing over-dredging, while also cutting 18% off inspection and acceptance time compared to traditional survey methods.

The seminar also discussed a training roadmap for high-tech equipment operators, a plan to equip 6 additional fixed GPS-RTK stations at key construction areas in 2025, and a direction to apply drone topographic surveys combined with GPS to reduce survey time from 3 days to just 4 hours.`,
  },
  {
    id: "5",
    title: "Hữu Thành mở rộng đội tàu nạo vét với 3 phương tiện mới",
    titleEn: "Huu Thanh expands dredging fleet with 3 new vessels",
    slug: "huu-thanh-mo-rong-doi-tau-nao-vet",
    date: "2024-07-10",
    category: "Thiết bị",
    categoryEn: "Equipment",
    thumbnail: "/images/thiet-bi/huu-thanh-co_132830581726080671.jpg",
    excerpt: "Nhằm đáp ứng nhu cầu ngày càng tăng, Hữu Thành đầu tư thêm 3 tàu nạo vét hiện đại, nâng tổng số phương tiện thủy lên 15 chiếc.",
    excerptEn: "To meet growing demand, Huu Thanh invested in 3 modern dredgers, bringing the total watercraft fleet to 15 vessels.",
    content: `Trong tháng 7/2024, Công ty Cổ phần Xây dựng Hữu Thành đã tiếp nhận 3 tàu nạo vét hút bụng tự hành mới, nâng tổng số phương tiện thủy trong đội tàu lên 15 chiếc. Đây là khoản đầu tư chiến lược trị giá gần 120 tỷ đồng, nhằm đáp ứng nhu cầu thi công ngày càng tăng trong lĩnh vực nạo vét và xây dựng thủy công.

Ba tàu mới có công suất từ 800 m³ đến 1.500 m³ bùn/giờ, được trang bị hệ thống điều hướng tự động tích hợp GPS-RTK, màn hình hiển thị độ sâu thời gian thực và hệ thống điều khiển từ xa. Các phương tiện này đáp ứng tiêu chuẩn môi trường MARPOL, đảm bảo không gây ô nhiễm nguồn nước trong quá trình thi công.

Với năng lực nạo vét hiện tại, Hữu Thành có khả năng xử lý đồng thời tới 5–6 gói thầu nạo vét quy mô lớn trải dài từ các cửa sông, luồng hàng hải đến hồ chứa nước và cảng biển. Điều này giúp công ty chủ động hơn trong việc đáp ứng các hợp đồng gấp hoặc có yêu cầu tiến độ cao.

Ông Trần Văn Hùng, Giám đốc Kỹ thuật, cho biết: "Việc mở rộng đội tàu không chỉ tăng năng lực sản xuất mà còn cho phép chúng tôi triển khai các phương án thi công song song, tối ưu hóa thời gian và chi phí cho từng dự án. Đây là nền tảng để Hữu Thành tiếp tục tăng trưởng trong 5 năm tới."`,
    contentEn: `In July 2024, Huu Thanh Construction Joint Stock Company received 3 new self-propelled trailing suction hopper dredgers, bringing the total number of watercraft in the fleet to 15 vessels. This strategic investment, valued at nearly 120 billion VND, is aimed at meeting the growing demand for dredging and hydraulic construction.

The three new vessels have capacities ranging from 800 m³ to 1,500 m³ of slurry per hour, and are equipped with automated navigation systems integrating GPS-RTK, real-time depth display screens, and remote control systems. These vessels comply with MARPOL environmental standards, ensuring no water pollution during construction.

With its current dredging capacity, Huu Thanh is capable of simultaneously handling 5–6 large-scale dredging contracts spanning river mouths, maritime channels, reservoirs, and seaports. This gives the company greater flexibility to fulfill urgent contracts or those with demanding schedules.

Mr. Tran Van Hung, Technical Director, stated: "Expanding the fleet not only increases production capacity but also allows us to implement parallel construction plans, optimizing time and cost for each project. This is the foundation for Huu Thanh to continue growing over the next 5 years."`,
  },
];

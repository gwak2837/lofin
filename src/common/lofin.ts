export const locals = {
  1100000: '서울',
  2600000: '부산',
  2700000: '대구',
  2800000: '인천',
  2900000: '광주',
  3000000: '대전',
  3100000: '울산',
  3200000: '세종',
  4100000: '경기',
  4200000: '강원',
  4300000: '충북',
  4400000: '충남',
  4500000: '전북',
  4600000: '전남',
  4700000: '경북',
  4800000: '경남',
  4900000: '제주',
} as Record<number, string>

export const localGovOptions = [
  { label: '전국', value: 'null' },
  {
    label: '서울',
    options: [
      { value: '11', label: '서울전체' },
      { value: '1100000', label: '서울본청' },
      { value: '1111000', label: '서울종로구' },
      { value: '1112000', label: '서울중구' },
      { value: '1113000', label: '서울용산구' },
      { value: '1114000', label: '서울성동구' },
      { value: '1115000', label: '서울광진구' },
      { value: '1116000', label: '서울동대문구' },
      { value: '1117000', label: '서울중랑구' },
      { value: '1118000', label: '서울성북구' },
      { value: '1119000', label: '서울강북구' },
      { value: '1120000', label: '서울도봉구' },
      { value: '1121000', label: '서울노원구' },
      { value: '1122000', label: '서울은평구' },
      { value: '1123000', label: '서울서대문구' },
      { value: '1124000', label: '서울마포구' },
      { value: '1125000', label: '서울양천구' },
      { value: '1126000', label: '서울강서구' },
      { value: '1127000', label: '서울구로구' },
      { value: '1128000', label: '서울금천구' },
      { value: '1129000', label: '서울영등포구' },
      { value: '1130000', label: '서울동작구' },
      { value: '1131000', label: '서울동작구' },
      { value: '1132000', label: '서울서초구' },
      { value: '1133000', label: '서울강남구' },
      { value: '1134000', label: '서울송파구' },
      { value: '1135000', label: '서울강동구' },
    ],
  },
  {
    label: '부산',
    options: [
      { value: '26', label: '부산전체' },
      { value: '2600000', label: '부산본청' },
      { value: '2611000', label: '부산중구' },
      { value: '2612000', label: '부산서구' },
      { value: '2613000', label: '부산동구' },
      { value: '2614000', label: '부산영도구' },
      { value: '2615000', label: '부산진구' },
      { value: '2616000', label: '부산동래구' },
      { value: '2617000', label: '부산남구' },
      { value: '2618000', label: '부산북구' },
      { value: '2619000', label: '부산해운대구' },
      { value: '2620000', label: '부산사하구' },
      { value: '2621000', label: '부산금정구' },
      { value: '2622000', label: '부산강서구' },
      { value: '2623000', label: '부산연제구' },
      { value: '2624000', label: '부산수영구' },
      { value: '2625000', label: '부산사상구' },
      { value: '2671000', label: '부산기장군' },
    ],
  },
  {
    label: '대구',
    options: [
      { value: '27', label: '대구전체' },
      { value: '2700000', label: '대구본청' },
      { value: '2711000', label: '대구중구' },
      { value: '2712000', label: '대구동구' },
      { value: '2713000', label: '대구서구' },
      { value: '2714000', label: '대구남구' },
      { value: '2715000', label: '대구북구' },
      { value: '2716000', label: '대구수성구' },
      { value: '2717000', label: '대구달서구' },
      { value: '2771000', label: '대구달성군' },
    ],
  },
  {
    label: '인천',
    options: [
      { value: '28', label: '인천전체' },
      { value: '2800000', label: '인천본청' },
      { value: '2811000', label: '인천중구' },
      { value: '2812000', label: '인천동구' },
      { value: '2813000', label: '인천미추홀구' },
      { value: '2814000', label: '인천연수구' },
      { value: '2815000', label: '인천남동구' },
      { value: '2816000', label: '인천부평구' },
      { value: '2817000', label: '인천계양구' },
      { value: '2818000', label: '인천서구' },
      { value: '2871000', label: '인천강화군' },
      { value: '2872000', label: '인천옹진군' },
    ],
  },
  {
    label: '광주',
    options: [
      { value: '29', label: '광주전체' },
      { value: '2900000', label: '광주본청' },
      { value: '2911000', label: '광주동구' },
      { value: '2912000', label: '광주서구' },
      { value: '2913000', label: '광주남구' },
      { value: '2914000', label: '광주북구' },
      { value: '2915000', label: '광주광산구' },
    ],
  },
  {
    label: '대전',
    options: [
      { value: '30', label: '대전전체' },
      { value: '3000000', label: '대전본청' },
      { value: '3011000', label: '대전동구' },
      { value: '3012000', label: '대전중구' },
      { value: '3013000', label: '대전서구' },
      { value: '3014000', label: '대전유성구' },
      { value: '3015000', label: '대전대덕구' },
    ],
  },
  {
    label: '울산',
    options: [
      { value: '31', label: '울산전체' },
      { value: '3100000', label: '울산본청' },
      { value: '3111000', label: '울산중구' },
      { value: '3112000', label: '울산남구' },
      { value: '3113000', label: '울산동구' },
      { value: '3114000', label: '울산북구' },
      { value: '3171000', label: '울산울주군' },
    ],
  },
  {
    label: '세종',
    options: [{ value: '3200000', label: '세종본청' }],
  },
  {
    label: '경기',
    options: [
      { value: '41', label: '경기전체' },
      { value: '4100000', label: '경기본청' },
      { value: '4111000', label: '경기수원시' },
      { value: '4112000', label: '경기성남시' },
      { value: '4113000', label: '경기의정부시' },
      { value: '4114000', label: '경기안양시' },
      { value: '4115000', label: '경기부천시' },
      { value: '4116000', label: '경기광명시' },
      { value: '4117000', label: '경기평택시' },
      { value: '4118000', label: '경기동두천시' },
      { value: '4119000', label: '경기안산시' },
      { value: '4120000', label: '경기고양시' },
      { value: '4121000', label: '경기과천시' },
      { value: '4122000', label: '경기구리시' },
      { value: '4123000', label: '경기남양주시' },
      { value: '4124000', label: '경기오산시' },
      { value: '4125000', label: '경기시흥시' },
      { value: '4126000', label: '경기군포시' },
      { value: '4127000', label: '경기의왕시' },
      { value: '4128000', label: '경기하남시' },
      { value: '4129000', label: '경기용인시' },
      { value: '4130000', label: '경기파주시' },
      { value: '4131000', label: '경기이천시' },
      { value: '4132000', label: '경기안성시' },
      { value: '4133000', label: '경기김포시' },
      { value: '4134000', label: '경기화성시' },
      { value: '4135000', label: '경기광주시' },
      { value: '4136000', label: '경기양주시' },
      { value: '4137000', label: '경기포천시' },
      { value: '4138000', label: '경기여주시' },
      { value: '4175000', label: '경기연천군' },
      { value: '4177000', label: '경기가평군' },
      { value: '4178000', label: '경기양평군' },
    ],
  },
  {
    label: '강원',
    options: [
      { value: '42', label: '강원전체' },
      { value: '4200000', label: '강원본청' },
      { value: '4211000', label: '강원춘천시' },
      { value: '4212000', label: '강원원주시' },
      { value: '4213000', label: '강원강릉시' },
      { value: '4214000', label: '강원동해시' },
      { value: '4215000', label: '강원태백시' },
      { value: '4216000', label: '강원속초시' },
      { value: '4217000', label: '강원삼척시' },
      { value: '4271000', label: '강원홍천군' },
      { value: '4272000', label: '강원횡성군' },
      { value: '4273000', label: '강원영월군' },
      { value: '4274000', label: '강원평창군' },
      { value: '4275000', label: '강원정선군' },
      { value: '4276000', label: '강원철원군' },
      { value: '4277000', label: '강원화천군' },
      { value: '4278000', label: '강원양구군' },
      { value: '4279000', label: '강원인제군' },
      { value: '4280000', label: '강원고성군' },
      { value: '4281000', label: '강원양양군' },
    ],
  },
  {
    label: '충북',
    options: [
      { value: '43', label: '충북전체' },
      { value: '4300000', label: '충북본청' },
      { value: '4312000', label: '충북충주시' },
      { value: '4313000', label: '충북제천시' },
      { value: '4314000', label: '충북청주시' },
      { value: '4372000', label: '충북보은군' },
      { value: '4373000', label: '충북옥천군' },
      { value: '4374000', label: '충북영동군' },
      { value: '4375000', label: '충북진천군' },
      { value: '4376000', label: '충북괴산군' },
      { value: '4377000', label: '충북음성군' },
      { value: '4378000', label: '충북단양군' },
      { value: '4379000', label: '충북증평군' },
    ],
  },
  {
    label: '충남',
    options: [
      { value: '44', label: '충남전체' },
      { value: '4400000', label: '충남본청' },
      { value: '4411000', label: '충남천안시' },
      { value: '4412000', label: '충남공주시' },
      { value: '4413000', label: '충남보령시' },
      { value: '4414000', label: '충남아산시' },
      { value: '4415000', label: '충남서산시' },
      { value: '4416000', label: '충남논산시' },
      { value: '4417000', label: '충남계룡시' },
      { value: '4418000', label: '충남당진시' },
      { value: '4471000', label: '충남금산군' },
      { value: '4473000', label: '충남부여군' },
      { value: '4474000', label: '충남서천군' },
      { value: '4475000', label: '충남청양군' },
      { value: '4476000', label: '충남홍성군' },
      { value: '4477000', label: '충남예산군' },
      { value: '4478000', label: '충남태안군' },
    ],
  },
  {
    label: '전북',
    options: [
      { value: '45', label: '전북전체' },
      { value: '4500000', label: '전북본청' },
      { value: '4511000', label: '전북전주시' },
      { value: '4512000', label: '전북군산시' },
      { value: '4513000', label: '전북익산시' },
      { value: '4514000', label: '전북정읍시' },
      { value: '4515000', label: '전북남원시' },
      { value: '4516000', label: '전북김제시' },
      { value: '4571000', label: '전북완주군' },
      { value: '4572000', label: '전북진안군' },
      { value: '4573000', label: '전북무주군' },
      { value: '4574000', label: '전북장수군' },
      { value: '4575000', label: '전북임실군' },
      { value: '4576000', label: '전북순창군' },
      { value: '4577000', label: '전북고창군' },
      { value: '4578000', label: '전북부안군' },
    ],
  },
  {
    label: '전남',
    options: [
      { value: '46', label: '전남전체' },
      { value: '4600000', label: '전남본청' },
      { value: '4611000', label: '전남목포시' },
      { value: '4612000', label: '전남여수시' },
      { value: '4613000', label: '전남순천시' },
      { value: '4614000', label: '전남나주시' },
      { value: '4615000', label: '전남광양시' },
      { value: '4671000', label: '전남담양군' },
      { value: '4672000', label: '전남곡성군' },
      { value: '4673000', label: '전남구례군' },
      { value: '4674000', label: '전남고흥군' },
      { value: '4675000', label: '전남보성군' },
      { value: '4676000', label: '전남화순군' },
      { value: '4677000', label: '전남장흥군' },
      { value: '4678000', label: '전남강진군' },
      { value: '4679000', label: '전남해남군' },
      { value: '4680000', label: '전남영암군' },
      { value: '4681000', label: '전남무안군' },
      { value: '4682000', label: '전남함평군' },
      { value: '4683000', label: '전남영광군' },
      { value: '4684000', label: '전남장성군' },
      { value: '4685000', label: '전남완도군' },
      { value: '4686000', label: '전남진도군' },
      { value: '4687000', label: '전남신안군' },
    ],
  },
  {
    label: '경북',
    options: [
      { value: '47', label: '경북전체' },
      { value: '4700000', label: '경북본청' },
      { value: '4711000', label: '경북포항시' },
      { value: '4712000', label: '경북경주시' },
      { value: '4713000', label: '경북김천시' },
      { value: '4714000', label: '경북안동시' },
      { value: '4715000', label: '경북구미시' },
      { value: '4716000', label: '경북영주시' },
      { value: '4717000', label: '경북영천시' },
      { value: '4718000', label: '경북상주시' },
      { value: '4719000', label: '경북문경시' },
      { value: '4720000', label: '경북경산시' },
      { value: '4771000', label: '경북군위군' },
      { value: '4772000', label: '경북의성군' },
      { value: '4773000', label: '경북청송군' },
      { value: '4774000', label: '경북영양군' },
      { value: '4775000', label: '경북영덕군' },
      { value: '4776000', label: '경북청도군' },
      { value: '4777000', label: '경북고령군' },
      { value: '4778000', label: '경북성주군' },
      { value: '4779000', label: '경북칠곡군' },
      { value: '4780000', label: '경북예천군' },
      { value: '4781000', label: '경북봉화군' },
      { value: '4782000', label: '경북울진군' },
      { value: '4783000', label: '경북울릉군' },
    ],
  },
  {
    label: '경남',
    options: [
      { value: '48', label: '경남전체' },
      { value: '4800000', label: '경남본청' },
      { value: '4811000', label: '경남창원시' },
      { value: '4813000', label: '경남진주시' },
      { value: '4815000', label: '경남통영시' },
      { value: '4816000', label: '경남사천시' },
      { value: '4817000', label: '경남김해시' },
      { value: '4818000', label: '경남밀양시' },
      { value: '4819000', label: '경남거제시' },
      { value: '4820000', label: '경남양산시' },
      { value: '4871000', label: '경남의령군' },
      { value: '4872000', label: '경남함안군' },
      { value: '4873000', label: '경남창녕군' },
      { value: '4874000', label: '경남고성군' },
      { value: '4875000', label: '경남남해군' },
      { value: '4876000', label: '경남하동군' },
      { value: '4877000', label: '경남산청군' },
      { value: '4878000', label: '경남함양군' },
      { value: '4879000', label: '경남거창군' },
      { value: '4880000', label: '경남합천군' },
    ],
  },
  {
    label: '제주',
    options: [{ value: '4900000', label: '제주본청' }],
  },
]

export const realms = [
  { value: '010', label: '일반공공행정' },
  { value: '020', label: '공공질서 및 안전' },
  { value: '050', label: '교육' },
  { value: '060', label: '문화 및 관광' },
  { value: '070', label: '환경' },
  { value: '080', label: '사회복지' },
  { value: '090', label: '보건' },
  { value: '100', label: '농림해양수산' },
  { value: '110', label: '산업ㆍ중소기업 및 에너지' },
  { value: '120', label: '교통 및 물류' },
  { value: '140', label: '국토 및 지역개발' },
  { value: '150', label: '과학기술' },
  { value: '160', label: '예비비' },
  { value: '900', label: '기타' },
]

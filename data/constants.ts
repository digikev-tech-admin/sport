import { Coach, Event } from "@/types/types";

// export const events: Event[] = [
//     {
//         id: '1',
//         title: 'Run For Cancer Event',
//         imageUrl: '/lovable-uploads/run-for-cancer.jpg',
//         date: 'May 22, 2023',
//         location: '123 Oak Street, CA 98765',
//         interested: 4700,
//         sport: 'Running'
//     },
//     {
//         id: '2',
//         title: 'Community Yoga Day',
//         imageUrl: '/lovable-uploads/community-yoga.jpg',
//         date: 'June 10, 2023',
//         location: '456 Maple Avenue, CA 90001',
//         interested: 3200,
//         sport: 'Yoga'
//     },
//     {
//         id: '3',
//         title: 'Charity Football Match',
//         imageUrl: '/lovable-uploads/charity-football.jpg',
//         date: 'July 5, 2023',
//         location: '789 Stadium Road, CA 90210',
//         interested: 5100,
//         sport: 'Football'
//     },
//     {
//         id: '4',
//         title: 'Health Awareness Walk',
//         imageUrl: '/lovable-uploads/health-walk.jpg',
//         date: 'August 15, 2023',
//         location: '321 Park Lane, CA 90300',
//         interested: 2800,
//         sport: 'Walking'
//     },
//     {
//         id: '5',
//         title: 'Kids Fun Run',
//         imageUrl: '/lovable-uploads/kids-fun-run.jpg',
//         date: 'September 2, 2023',
//         location: '654 Playground Blvd, CA 90400',
//         interested: 1500,
//         sport: 'Golf'
//     },
//     {
//         id: '6',
//         title: 'Senior Fitness Meetup',
//         imageUrl: '/lovable-uploads/senior-fitness.jpg',
//         date: 'October 20, 2023',
//         location: '987 Wellness St, CA 90500',
//         interested: 900,
//         sport: 'Fitness'
//     }
//   ];

// export const coaches: Coach[] = [
//   {
//     id: '1',
//     name: 'David Patel',
//     imageUrl: 'images/Coache.png',
//     clubs: [
//       'Elite Ortho Club',
//       'Sunrise Fitness Club'
//     ],
//     sports: ["Racket Ball", "Squash"],
//     rating: 4.5,
//     reviews: 1872,
//     isFavorite: false
//   },
//   {
//     id: '2',
//     name: 'Sophia Lee',
//     imageUrl: 'images/Coache.png',
//     clubs: [
//       'Downtown Tennis Center',
//       'Ace Sports Club'
//     ],
//     sports: ["Tennis", "Badminton"],
//     rating: 4.8,
//     reviews: 2103,
//     isFavorite: true
//   },
//   {
//     id: '3',
//     name: 'Michael Chen',
//     imageUrl: 'images/Coache.png',
//     clubs: [
//       'ProFit Gym',
//       'City Sports Arena'
//     ],
//     sports: ["Basketball", "Volleyball"],
//     rating: 4.2,
//     reviews: 980,
//     isFavorite: false
//   },
//   {
//     id: '4',
//     name: 'Emily Carter',
//     imageUrl: 'images/Coache.png',
//     clubs: [
//       'Wellness Hub',
//       'Greenfield Club'
//     ],
//     sports: ["Yoga", "Pilates"],
//     rating: 4.9,
//     reviews: 3245,
//     isFavorite: true
//   },
//   {
//     id: '5',
//     name: 'Carlos Rivera',
//     imageUrl: 'images/Coache.png',
//     clubs: [
//       'Champion Sports Complex',
//       'Rivera Athletics'
//     ],
//     sports: ["Football", "Baseball"],
//     rating: 4.3,
//     reviews: 1567,
//     isFavorite: false
//   },
//   {
//     id: '6',
//     name: 'Priya Singh',
//     imageUrl: 'images/Coache.png',
//     clubs: [
//       'Sunrise Fitness Club',
//       'Yoga Bliss Center'
//     ],
//     sports: ["Yoga", "Aerobics"],
//     rating: 4.7,
//     reviews: 2011,
//     isFavorite: true
//   }
// ];


// export const packages: Package[] = [
//   {
//     id: '1',
//     sport: 'Racket Ball',
//     level: 'Intermediate',
//     clubs: 'Lion Club',
//     ageGroup: 'Children 10 Yrs-18 Yrs',
//     startDate: '4 July 2025',
//     time: '4.00 PM-8.00 PM',
//     days: 'Mon-Wed-Fri',
//     price: '$30',
//     placesLeft: 40
//   },
//   {
//     id: '2',
//     sport: 'Squash',
//     level: 'Beginner',
//     clubs: 'Sunrise Sports Arena',
//     ageGroup: 'Children 8 Yrs-14 Yrs',
//     startDate: '10 August 2025',
//     time: '5.00 PM-7.00 PM',
//     days: 'Tue-Thu',
//     price: '$25',
//     placesLeft: 25
//   },
//   {
//     id: '3',
//     sport: 'Tennis',
//     level: 'Advanced',
//     clubs: 'Ace Tennis Club',
//     ageGroup: 'Teens 13 Yrs-19 Yrs',
//     startDate: '15 September 2025',
//     time: '6.00 PM-9.00 PM',
//     days: 'Mon-Fri',
//     price: '$40',
//     placesLeft: 18
//   },
//   {
//     id: '4',
//     sport: 'Football',
//     level: 'Intermediate',
//     clubs: 'Champion Field',
//     ageGroup: 'Children 9 Yrs-15 Yrs',
//     startDate: '1 October 2025',
//     time: '3.00 PM-6.00 PM',
//     days: 'Sat-Sun',
//     price: '$35',
//     placesLeft: 30
//   },
//   {
//     id: '5',
//     sport: 'Yoga',
//     level: 'Beginner',
//     clubs: 'Wellness Hub',
//     ageGroup: 'Adults 18 Yrs-40 Yrs',
//     startDate: '20 July 2025',
//     time: '7.00 AM-8.30 AM',
//     days: 'Mon-Wed-Fri',
//     price: '$20',
//     placesLeft: 50
//   },
//   {
//     id: '6',
//     sport: 'Basketball',
//     level: 'Advanced',
//     clubs: 'City Sports Arena',
//     ageGroup: 'Teens 14 Yrs-18 Yrs',
//     startDate: '5 August 2025',
//     time: '5.30 PM-8.30 PM',
//     days: 'Tue-Thu',
//     price: '$45',
//     placesLeft: 12
//   }
// ];
  







export const ageGroups = [
  "All",  
  "Kids",
  "Teens",
  "Adults",
];



export const levels = [
  {id: 1, name: "Beginner"},
  {id: 2, name: "Intermediate"},
  {id: 3, name: "Advanced"},
];


export const sportsOptions = [
  {id: 1, name: "Racket Ball"},
  {id: 2, name: "Squash"},
  {id: 3, name: "Tennis"},
  {id: 4, name: "Badminton"},
  {id: 5, name: "Yoga"},
  {id: 6, name: "Pilates"},
  {id: 7, name: "Football"},
  {id: 8, name: "Basketball"},
  {id: 11, name: "Hockey"},
  {id: 12, name: "Golf"},
  {id: 13, name: "Cricket"},
  {id: 14, name: "Rugby"},
  {id: 15, name: "Table Tennis"},
  {id: 16, name: "Swimming"},
  {id: 17, name: "Running"},
  {id: 18, name: "Cycling"},
  {id: 19, name: "Walking"},
  {id: 20, name: "Gymnastics"},
  {id: 21, name: "Martial Arts"},
  {id: 22, name: "Chess"},
  {id: 23, name: "Volleyball"},
  {id: 24, name: "Baseball"},
];



export const dummyUsers = [
    
  {
    id: "1",
    name: "Ravi Mishra",
    email: "ravi@gmail.com",
    phone: "987-654-3210",
    level: "Intermediate",
    ageGroup: "26-35",
    avatar: "https://github.com/shadcn.png",
    price: "£150",
    status: "Active",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    level: "Beginner",
    ageGroup: "18-25",
    avatar: "https://github.com/shadcn.png",
    price: "£100",
    status: "Active",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    level: "Intermediate",
    ageGroup: "26-35",
    avatar: "https://github.com/shadcn.png",
    price: "£150",
    status: "Inactive",
  },

];




export const paymentMethodOptions = [
  { id: 1, name: "Cash" }, 
  { id: 2, name: "Card" },
  { id: 3, name: "Auto Debit (Monthly Direct Debit)" },
];




export const formatPaymentLabel = (value: string) => {
  if (!value) return value;
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

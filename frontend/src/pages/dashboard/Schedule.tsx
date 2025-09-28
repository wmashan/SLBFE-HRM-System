import { 
  Calendar, 
  Clock, 
  Users, 
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Video,
  Coffee,
  Briefcase
} from 'lucide-react';

const Schedule = () => {
  const currentDate = new Date();
  const today = currentDate.getDate();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Sample schedule data
  const upcomingEvents = [
    {
      id: 1,
      title: "Team Meeting",
      time: "10:00 AM - 11:00 AM",
      date: "2025-09-29",
      type: "meeting",
      attendees: 8,
      location: "Conference Room A",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      title: "John Doe - Interview",
      time: "2:00 PM - 3:00 PM",
      date: "2025-09-29",
      type: "interview",
      attendees: 3,
      location: "HR Office",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      title: "Department Review",
      time: "9:00 AM - 10:30 AM",
      date: "2025-09-30",
      type: "review",
      attendees: 12,
      location: "Virtual - Zoom",
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: 4,
      title: "Training Session",
      time: "3:00 PM - 4:30 PM",
      date: "2025-09-30",
      type: "training",
      attendees: 25,
      location: "Training Hall",
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const scheduleStats = {
    todayEvents: 3,
    thisWeekEvents: 12,
    totalMeetings: 45,
    upcomingInterviews: 8
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDate = new Date(firstDay);
    startingDate.setDate(startingDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const current = new Date(startingDate);
    
    // Generate 6 weeks worth of dates
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
    }
    
    return calendar;
  };

  const calendar = generateCalendarGrid();

  const StatCard = ({ title, value, color, icon: Icon }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const getEventIcon = (type: string) => {
    const icons = {
      meeting: Briefcase,
      interview: Users,
      review: Clock,
      training: Coffee
    };
    return icons[type as keyof typeof icons] || Clock;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Events"
          value={scheduleStats.todayEvents}
          icon={Calendar}
          color="#3B82F6"
        />
        <StatCard
          title="This Week"
          value={scheduleStats.thisWeekEvents}
          icon={Clock}
          color="#10B981"
        />
        <StatCard
          title="Total Meetings"
          value={scheduleStats.totalMeetings}
          icon={Briefcase}
          color="#8B5CF6"
        />
        <StatCard
          title="Upcoming Interviews"
          value={scheduleStats.upcomingInterviews}
          icon={Users}
          color="#F59E0B"
        />
      </div>

      {/* Calendar and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{currentMonth}</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendar.flat().map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = date.getDate() === today && isCurrentMonth;
              const hasEvent = isCurrentMonth && [29, 30].includes(date.getDate());
              
              return (
                <div
                  key={index}
                  className={`
                    h-10 flex items-center justify-center text-sm cursor-pointer relative
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${isToday ? 'bg-blue-600 text-white rounded-lg font-semibold' : 'hover:bg-gray-100 rounded-lg'}
                  `}
                >
                  {date.getDate()}
                  {hasEvent && !isToday && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 6).map((event) => {
              const IconComponent = getEventIcon(event.type);
              return (
                <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`p-1.5 rounded-full mr-2 ${event.color}`}>
                        <IconComponent className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      {event.location.includes('Virtual') ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <MapPin className="w-3 h-3 mr-1" />
                      )}
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {event.attendees}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Events →
            </button>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {upcomingEvents
            .filter(event => event.date === "2025-09-29")
            .map((event) => {
              const IconComponent = getEventIcon(event.type);
              return (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${event.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.time}
                        <span className="mx-2">•</span>
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {event.attendees} attendees
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Schedule Meeting</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Users className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Book Interview</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Coffee className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Schedule Training</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Calendar className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">View Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
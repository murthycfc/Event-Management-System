import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageEvents from "./pages/ManageEvents";
import ManageVenues from "./pages/ManageVenues";
import ManageBookings from "./pages/ManageBookings";
import EditEvent from "./pages/EditEvent";
import AddEvent from "./pages/AddEvent";
import EditVenue from "./pages/EditVenue";
import VenueDetails from "./pages/VenueDetails";
import AdminEventDetails from "./pages/AdminEventDetails ";
import AllBookings from "./pages/AllBookings";
import CompletedBookings from "./pages/CompletedBookings";
import CancelledBookings from "./pages/CancelledBookings";

export default function App(){
const router = createBrowserRouter([
  {
    path:"/",
    element:<RootLayout />,
    children:[
      {
        index: true,
        element: <Home />
      },
      {
        path: "events",
        element: <Events />
      },
      {
        path: "events/:eventId",
        element: <EventDetails />
      },
      {
        path: "events/:eventId/seats",
        element: <SeatSelection />
      },
      {
        path: "booking/confirmation/:bookingId",
        element: <BookingConfirmation />
      },
      {
        path: "myBookings",
        element: <MyBookings />
      },
      {
        path: "myBookings/:bookingId",
        element: <BookingDetails />
      }
    ]
  },
  {
    path:"/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: "events",
        element: <ManageEvents />
      },
      {
        path:"events/:eventId",
        element: <AdminEventDetails />
      },
      {
        path:"events/:eventId/edit",
        element: <EditEvent />
      },
      {
        path:"events/add",
        element: <AddEvent />
      },
      {
        path: "venues",
        element: <ManageVenues />
      },
      {
      path:"venues/:venueId",
      element:<VenueDetails />
      },
      {
        path: "venues/:venueId/edit",
        element: <EditVenue />
      },
      {
        path: "bookings",
        element: <ManageBookings />,
        children: [
          {
            index: true,
            element: <AllBookings />
          },
          {
            path: "completed",
            element: <CompletedBookings />
          },
          {
            path: "cancelled",
            element: <CancelledBookings />
          },
          
        ]

      }
    ]
  },
  {
    path:"/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
])


  return <RouterProvider router={router}/>
}
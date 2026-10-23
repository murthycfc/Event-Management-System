import { Building2, Calendar, Calendar1, LayoutDashboard, Ticket } from "lucide-react"
import { NavLink } from "react-router"

export default function AdminSidebar(){

    const links = [
        {
            to:"/admin",
            label: "Dashboard",
            icon: <LayoutDashboard size={20}/>
        },
        {
            to:"/admin/venues",
            label: "Venues",
            icon: <Building2 size={20}/>
        },
        {
            to:"/admin/events",
            label: "Events",
            icon: <Calendar1 size={20}/>
        },
        {
            to:"/admin/bookings",
            label: "Bookings",
            icon: <Ticket size={20}/>
        }
    ]
    return(
        <aside 
            className="text-white flex-shrink-0"
            style={{
                width: "220px",
                backgroundColor: "#1E2433"
            }}
        >
            <div className="p-3">
                <h5 className="text-white text-uppercase small mb-3">
                    Administration
                </h5>
                <div className="d-flex flex-column gap-1">
                    { links.map((link) =>(
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to ==="/admin"}
                            className={({isActive})=>
                                `d-flex align-items-center text-decoration-none gap-3 rounded px-3 py-2
                                ${isActive ? "text-white" : "text-white-50"}
                            `
                            }
                            style={({isActive}) =>({
                                backgroundColor: isActive ? '#554EE2': 'transparent'
                            })}

                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </div>

            </div>
        </aside>
    )
}
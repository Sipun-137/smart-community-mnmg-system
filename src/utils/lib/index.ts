/* 
    nav links 
    {
        label:"name".
        url:"/link"
    }
*/


export const adminNavLinks = [
    {
        label: "dashboard",
        url: "/dashboard/admin"
    },
    {
        label: "Users",
        url: "/dashboard/admin/user"
    },
    {
        label: "Complaints",
        url: "/dashboard/admin/complaints"
    },
    {
        label: "Payments",
        url: "/dashboard/admin/payments"
    },
    {
        label: "Visitors",
        url: "/dashboard/admin/visitors"
    },
    {
        label: "Notices",
        url: "/dashboard/admin/notices"
    },
    {
        label: "Events",
        url: "/dashboard/admin/events"
    },
    {
        label: "security-alerts",
        url: "/dashboard/admin/security-alerts"
    }
    ,
    {
        label: "Parking",
        url: "/dashboard/admin/parking"
    }
];
export const residentNavLinks = [
    {
        label: "dashboard",
        url: "/dashboard/resident"
    },
    {
        label:"Payment",
        url: "/dashboard/resident/payment"
    },
    {
        label: "Visitors",
        url: "/dashboard/resident/visitor"
    }, {
        label: "Parking",
        url: "/dashboard/resident/parking"
    }, 
];

export const securityNavLinks = [
    {
        label: "dashboard",
        url: "/dashboard/security"
    },
    {
        label:"Parking",
        url:"/dashboard/security/parking"
    }
];

export const MaintenanceLinks = [
    {
        label: "dashboard",
        url: "dashboard/maintainance"
    },
];

export const communityname = "Falcon"
export const base_url = "http://localhost:3000/api"
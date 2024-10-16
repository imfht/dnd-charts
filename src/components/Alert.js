import React from 'react';

   const Alert = ({ variant = 'default', title, description, icon: Icon }) => {
     const baseStyles = "p-4 rounded-md my-4";
     const variantStyles = {
       default: "bg-blue-100 text-blue-800",
       destructive: "bg-red-100 text-red-800",
     };

     return (
       <div className={`${baseStyles} ${variantStyles[variant]}`}>
         <div className="flex items-start">
           {Icon && <Icon className="h-5 w-5 mr-2 mt-0.5" />}
           <div>
             {title && <h3 className="font-medium">{title}</h3>}
             {description && <p className="text-sm">{description}</p>}
           </div>
         </div>
       </div>
     );
   };

   export { Alert };
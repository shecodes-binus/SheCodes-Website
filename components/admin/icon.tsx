// Using react-icons is generally easier
// npm install react-icons
// Example usage:
import {
    FiCalendar, FiUsers, FiUser, FiFileText, FiSearch, FiBell,
    FiPlus, FiEdit, FiTrash2, FiX, FiChevronLeft, FiChevronRight,
    FiChevronsLeft, FiChevronsRight, FiUserCheck
} from 'react-icons/fi'; // Choose icons you like

export {
    FiCalendar as EventIcon,
    FiUsers as MentorsIcon,
    FiUser as MembersIcon, // Using FiUser for members
    FiFileText as ArticlesIcon,
    FiSearch as SearchIcon,
    FiBell as BellIcon,
    FiPlus as PlusIcon,
    FiEdit as EditIcon,
    FiTrash2 as DeleteIcon,
    FiX as CloseIcon,
    FiChevronLeft as ChevronLeftIcon,
    FiChevronRight as ChevronRightIcon,
    FiChevronsLeft as ChevronsLeftIcon,
    FiChevronsRight as ChevronsRightIcon,
    FiUserCheck as ViewParticipantsIcon, // Example icon
};

// You can also create custom SVG components if needed
// export const LogoIcon = () => ( <svg>...</svg> );
import React, { useMemo, useCallback } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Paper,
  Grid,
  useTheme
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarProps {
  date?: Date;
  onDateChange?: (date: Date) => void;
  hasNote?: (date: string) => boolean;
}

const Calendar: React.FC<CalendarProps> = ({ 
  date = new Date(), 
  onDateChange,
  hasNote 
}) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = React.useState(date);

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    // Add previous month's days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({ 
        date: prevDate.getDate(),
        fullDate: prevDate,
        isCurrentMonth: false 
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const dateString = currentDate.toISOString().split('T')[0];
      days.push({ 
        date: i,
        fullDate: currentDate,
        dateString,
        isCurrentMonth: true,
        isToday: new Date().toDateString() === currentDate.toDateString(),
        isSelected: date.toDateString() === currentDate.toDateString(),
        hasNote: hasNote?.(dateString)
      });
    }
    
    // Add only enough days to complete the last week
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({ 
          date: i,
          fullDate: nextDate,
          isCurrentMonth: false 
        });
      }
    }
    
    return days;
  }, [hasNote, date]);

  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(new Date(newDate));
    onDateChange?.(newDate);
  }, [currentDate, onDateChange]);

  const handleNextMonth = useCallback(() => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(new Date(newDate));
    onDateChange?.(newDate);
  }, [currentDate, onDateChange]);

  const days = useMemo(() => getDaysInMonth(currentDate), [getDaysInMonth, currentDate]);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      {/* Calendar Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2
      }}>
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6">
          {currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Weekday Headers */}
      <Grid container spacing={0}>
        {weekDays.map(day => (
          <Grid item xs key={day} sx={{ textAlign: 'center' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 'bold',
                color: 'text.secondary'
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Days */}
      <Grid container spacing={0} sx={{ mt: 1 }}>
        {days.map((day, index) => (
          <Grid item xs key={index}>
            <Box
              onClick={() => day.isCurrentMonth && onDateChange?.(day.fullDate)}
              sx={{
                position: 'relative',
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: day.isCurrentMonth ? 'pointer' : 'default',
                borderRadius: 1,
                m: 0.3,
                p: 0.5,
                minHeight: '40px',
                minWidth: '40px',
                transition: 'all 0.2s',
                ...(day.isToday && {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }),
                ...(day.isSelected && {
                  backgroundColor: 'primary.light',
                  color: 'white',
                }),
                ...(!day.isCurrentMonth && {
                  color: 'text.disabled',
                  pointerEvents: 'none',
                }),
                '&:hover': day.isCurrentMonth ? {
                  backgroundColor: day.isToday 
                    ? 'primary.dark'
                    : 'action.hover',
                } : {}
              }}
            >
              <Typography 
                variant="body2"
                sx={{ 
                  fontWeight: (day.isToday || day.isSelected) ? 'bold' : 'normal',
                  fontSize: '0.875rem',
                  lineHeight: 1
                }}
              >
                {day.date}
              </Typography>
              {day.hasNote && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '2px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: day.isSelected || day.isToday ? 'white' : 'primary.main'
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Calendar; 
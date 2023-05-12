import { Box, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { GridItem } from "../../theme";
import { UserAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { queryCollection } from "../../context/FirebaseContext";
import { ResponsivePie } from '@nivo/pie';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const Dashboard = ({ setAler }) => {

  const { user } = UserAuth();

  const [pieData, setPieData] = useState([]);

  const [date, setDate] = useState(new Date());

  const onChange = (date) => {
    setDate(date);
  };


  useEffect(() => {
    queryCollection('user_games', [
      {field: 'user_id', operator: '==', value: user.id}
    ]).then((res) => {
      if (res.length > 0 || res !== undefined) {
        setPieData([
          {
            id: 'played',
            label: 'Played',
            value: res.times_played,
            color: '#1D2B53'
          },
          {
            id: 'won',
            label: 'played',
            value: res.times_won,
            color: '#FFD983'
          },
          {
            id: 'tied',
            label: 'Tied',
            value: res.times_tied,
            color: '#6EC4E8'
          },
          {
            id: 'lost',
            label: 'Lost',
            value: res.times_lost,
            color: '#E84855'
          },
        ]);
      }
    }).catch((err) => {
      setAler({
        status: 'warning',
        message: err.message
      });
    })
  }, [user, setAler]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <GridItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <Typography variant="h2">
              Results Chart
            </Typography>
            <Box sx={{
              height: '283px', width: '400px',
            }}>
              { pieData.length > 0 ? (
                <ResponsivePie
                  data={pieData}
                  margin={{ top: 10, right: 80, bottom: 80, left: 120 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  colors={{ datum: 'data.color' }}
                  borderWidth={1}
                  arcLinkLabelsTextColor='#fff'
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  enableRadialLabels={false}
                  enableSliceLabels={true}
                  sliceLabel="value"
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: '#fff',
                      itemDirection: 'left-to-right',
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: 'circle',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemTextColor: '#9b9b9b'
                          }
                        }
                      ]
                    }
                  ]}
                />
              ) : (
                <Box display='flex' width='100%' justifyContent='center'>
                  <Typography variant="h4">You haven't played a game!</Typography>
                </Box>
              )}
            </Box>
          </GridItem>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <GridItem sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <Typography variant="h2" sx={{ mb: 2}}>
              Calendar
            </Typography>
            <Calendar onChange={onChange} value={date} />
          </GridItem>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard

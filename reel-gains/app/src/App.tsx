/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { PlansPage } from './pages/PlansPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { ActiveWorkoutPage } from './pages/ActiveWorkoutPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WorkoutsPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="exercises" element={<ExercisesPage />} />
        </Route>
        <Route path="/workout/active" element={<ActiveWorkoutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

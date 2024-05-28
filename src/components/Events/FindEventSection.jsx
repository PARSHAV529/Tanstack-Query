import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { fetchEvents } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearch] = useState();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events', searchTerm],
    queryFn: ({signal}) => fetchEvents({searchTerm,signal}),
    enabled:searchTerm !==undefined

  })

  let content = <p>Please enter a search term and to find events.</p>

  if (isLoading) {
    content = <LoadingIndicator />
  }

  if (isError) {
    content = <ErrorBlock message={error?.message || 'Failed to fetch events'} />
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>)
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSearch(searchElement.current.value)
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
